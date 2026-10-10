(function site() {
  "use strict";

  /* Configuração da demonstração. Para usar em uma loja real, informe DDD + número. */
  const CONFIG = {
    storeName: "NEXO Mobile",
    whatsappNumber: "", // Exemplo: "5511999999999" (sem +, espaços ou traços)
    currency: "BRL"
  };

  /*
   * 55 iPhones lançados/apresentados até outubro de 2026.
   * year = ano de lançamento; lenses = ilustração esquemática, não render oficial.
   * Este catálogo de demonstração NÃO significa estoque disponível.
   */
  const rawModels = [
    ["iPhone 18 Pro Max",2026,3,"#9b747f"],
    ["iPhone 18 Pro",2026,3,"#a98a8e"],
    ["iPhone Duo",2026,2,"#9ca5ad"],
    ["iPhone 17e",2026,1,"#c8b8c5"],
    ["iPhone 17 Pro Max",2025,3,"#bb8464"],
    ["iPhone 17 Pro",2025,3,"#c5a68e"],
    ["iPhone 17",2025,2,"#9eafbd"],
    ["iPhone Air",2025,1,"#a9bac4"],
    ["iPhone 16e",2025,1,"#cbd0cb"],
    ["iPhone 16 Pro Max",2024,3,"#aa9a86"],
    ["iPhone 16 Pro",2024,3,"#b8a490"],
    ["iPhone 16 Plus",2024,2,"#a7a9cd"],
    ["iPhone 16",2024,2,"#9cafb2"],
    ["iPhone 15 Pro Max",2023,3,"#899ca0"],
    ["iPhone 15 Pro",2023,3,"#aaa9aa"],
    ["iPhone 15 Plus",2023,2,"#a9cabd"],
    ["iPhone 15",2023,2,"#b7c8dc"],
    ["iPhone 14 Pro Max",2022,3,"#817687"],
    ["iPhone 14 Pro",2022,3,"#b5aab6"],
    ["iPhone 14 Plus",2022,2,"#b7b8d8"],
    ["iPhone 14",2022,2,"#bcd5cd"],
    ["iPhone SE (3ª geração)",2022,1,"#c9c9c7"],
    ["iPhone 13 Pro Max",2021,3,"#b8b6a9"],
    ["iPhone 13 Pro",2021,3,"#99aabd"],
    ["iPhone 13",2021,2,"#cebac5"],
    ["iPhone 13 mini",2021,2,"#a3bfd3"],
    ["iPhone 12 Pro Max",2020,3,"#b0b3ac"],
    ["iPhone 12 Pro",2020,3,"#a3b2c4"],
    ["iPhone 12",2020,2,"#adcbbb"],
    ["iPhone 12 mini",2020,2,"#c1c3da"],
    ["iPhone SE (2ª geração)",2020,1,"#c9ccc9"],
    ["iPhone 11 Pro Max",2019,3,"#a7b8a6"],
    ["iPhone 11 Pro",2019,3,"#a6aaa7"],
    ["iPhone 11",2019,2,"#d2c0a1"],
    ["iPhone XS Max",2018,2,"#c2b39c"],
    ["iPhone XS",2018,2,"#aeb3b7"],
    ["iPhone XR",2018,1,"#c3d4bb"],
    ["iPhone X",2017,2,"#afb0ae"],
    ["iPhone 8 Plus",2017,2,"#d7c3a5"],
    ["iPhone 8",2017,1,"#bdc0bc"],
    ["iPhone 7 Plus",2016,2,"#9a9b9e"],
    ["iPhone 7",2016,1,"#b8b7b8"],
    ["iPhone SE (1ª geração)",2016,1,"#bcbec2"],
    ["iPhone 6s Plus",2015,1,"#ccb6ae"],
    ["iPhone 6s",2015,1,"#c9b4b2"],
    ["iPhone 6 Plus",2014,1,"#c3b6a9"],
    ["iPhone 6",2014,1,"#b6b8b5"],
    ["iPhone 5s",2013,1,"#a6a8ad"],
    ["iPhone 5c",2013,1,"#94bdb1"],
    ["iPhone 5",2012,1,"#b6b6b9"],
    ["iPhone 4s",2011,1,"#b0b4b5"],
    ["iPhone 4",2010,1,"#b8bbbb"],
    ["iPhone 3GS",2009,0,"#8e999e"],
    ["iPhone 3G",2008,0,"#aab3b1"],
    ["iPhone (original)",2007,0,"#a4aab2"]
  ];

  const catalog = rawModels.map(([name,year,lenses,color],index) => ({
    id: "iphone-" + index,
    name, year, lenses, color,
    fold: name === "iPhone Duo",
    isPro: / Pro(?: |$)/.test(name),
    isMax: /Max/.test(name),
    isSE: / SE /.test(name),
    isMini: / mini/.test(name),
    isE: /\de$/.test(name),
    category: year >= 2024 ? "Linha recente" : year >= 2020 ? "Gerações populares" : "Coleção clássica",
    era: year <= 2015 ? "Edição histórica" : year <= 2019 ? "Clássico" : year >= 2025 ? "Últimas gerações" : "Linha iPhone"
  }));

  const el = id => document.getElementById(id);
  const grid = el("productGrid");
  const tabs = [...document.querySelectorAll("[data-filter]")].filter(x => x.classList.contains("tab"));
  const BRL = amount => new Intl.NumberFormat("pt-BR", {style:"currency",currency:CONFIG.currency,maximumFractionDigits:0}).format(amount);
  const storageLabel = storage => Number(storage) >= 1024 ? Number(storage)/1024 + " TB" : storage + " GB";
  const safeStorage = {
    get(k) {try{return JSON.parse(localStorage.getItem(k))}catch{return null}},
    set(k,v) {try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
  };
  const favorites = new Set((safeStorage.get("nexo_favorites") || []).filter(id=>catalog.some(p=>p.id===id)));
  let filter = "todos";
  let search = "";
  let sort = "recent";
  let limit = 12;
  let lastTradeMessage = "";
  let activeProduct = null;
  let toastTimeout = null;

  function notify(message){
    const toast = el("toast");
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(()=>toast.classList.remove("visible"),3300);
  }
  function whatsappURL(message){
    const phone = String(CONFIG.whatsappNumber).replace(/\D/g,"");
    return "https://api.whatsapp.com/send?" + (phone ? "phone="+encodeURIComponent(phone)+"&" : "") + "text=" + encodeURIComponent(message);
  }
  function openWhatsapp(message){
    if(!CONFIG.whatsappNumber){notify("Demonstração: escolha um contato no WhatsApp. Configure o número real no app.js.");}
    window.open(whatsappURL(message),"_blank","noopener,noreferrer");
  }
  function setFilter(next){
    filter = next;
    limit = 12;
    tabs.forEach(t=>{
      const active = t.dataset.filter === next;
      t.classList.toggle("active",active);
      t.setAttribute("aria-pressed",String(active));
    });
    renderCatalog();
  }
  function filteredModels(){
    let results = catalog.filter(m=>{
      if(filter === "recentes" && m.year < 2024) return false;
      if(filter === "pro" && !m.isPro) return false;
      if(filter === "acessiveis" && (m.isPro || m.isMax || m.fold)) return false;
      if(filter === "classicos" && m.year > 2019) return false;
      if(filter === "favoritos" && !favorites.has(m.id)) return false;
      return (m.name + " " + m.year).toLowerCase().includes(search);
    });
    if(sort === "oldest") results.sort((a,b)=>a.year-b.year||a.name.localeCompare(b.name,"pt-BR"));
    if(sort === "name") results.sort((a,b)=>a.name.localeCompare(b.name,"pt-BR"));
    return results;
  }
  function phoneArt(m){
    return '<div class="device-art" style="--shell:'+m.color+'" data-lenses="'+m.lenses+'" data-fold="'+m.fold+'" aria-hidden="true"><span class="device-camera">'+Array.from({length:m.lenses},()=>"<i></i>").join("")+'</span><span class="device-logo"></span></div>';
  }
  function cardHTML(m){
    const heart = favorites.has(m.id);
    const label = m.year === 2026 ? "NOVO MODELO" : m.year >= 2024 ? "DESTAQUE" : m.year <= 2015 ? "HISTÓRICO" : "CONSULTAR";
    return '<article class="product-card" data-id="'+m.id+'">'+
      '<div class="product-art"><span class="product-tag '+(m.year >= 2025 ? "tag-new":"")+'">'+label+'</span>'+
      '<button class="favorite-toggle '+(heart ? "is-favorite":"")+'" type="button" data-favorite="'+m.id+'" aria-label="'+(heart?"Remover dos favoritos: ":"Adicionar aos favoritos: ")+m.name+'" aria-pressed="'+heart+'">'+(heart?"♥":"♡")+'</button>'+phoneArt(m)+'</div>'+
      '<div class="product-data"><div class="product-series">'+m.year+' · '+m.era.toUpperCase()+'</div>'+
      '<h3 class="product-name">'+m.name+'</h3>'+
      '<div class="product-detail">Modelos, cores e estoque sob consulta</div>'+
      '<div class="product-bottom"><div><small>DISPONIBILIDADE</small><strong>Sob consulta</strong></div>'+
      '<button class="product-action" type="button" data-open="'+m.id+'" aria-label="Ver detalhes do '+m.name+'">↗</button></div></div></article>';
  }
  function updateFavCount(){
    el("favCount").textContent = favorites.size;
    el("favoriteShortcut").setAttribute("aria-label","Ver "+favorites.size+" favoritos");
  }
  function renderCatalog(){
    const results = filteredModels();
    grid.innerHTML = results.length ? results.slice(0,limit).map(cardHTML).join("") :
      '<div class="catalog-empty"><strong>Nenhum modelo encontrado.</strong>Tente outro nome ou selecione um filtro diferente.</div>';
    el("resultCount").textContent = results.length+" modelos encontrados · mostrando "+Math.min(results.length,limit);
    el("loadMore").hidden = results.length <= limit;
    updateFavCount();
  }
  function toggleFavorite(id){
    const m = catalog.find(p=>p.id===id);
    if(!m) return;
    if(favorites.has(id)){favorites.delete(id);notify(m.name+" removido dos favoritos.");}
    else{favorites.add(id);notify(m.name+" salvo nos favoritos.");}
    safeStorage.set("nexo_favorites",[...favorites]);
    renderCatalog();
  }
  function openProduct(id){
    const m = catalog.find(p=>p.id===id);
    if(!m) return;
    activeProduct = m;
    el("dialogContent").innerHTML =
      '<div class="dialog-grid"><div class="dialog-art">'+phoneArt(m)+'</div>'+
      '<div class="dialog-data"><div class="eyebrow"><span class="eyebrow-line"></span> DETALHES DO MODELO</div>'+
      '<h3 id="dialogTitle">'+m.name+'</h3><p>Confira informações básicas e converse sobre cores, capacidades disponíveis e valores diretamente com a loja.</p>'+
      '<div class="dialog-meta"><div><span>Geração / ano</span><strong>'+m.year+'</strong></div>'+
      '<div><span>Família</span><strong>'+m.category+'</strong></div>'+
      '<div><span>Estoque e preço</span><strong>Confirmar com a loja</strong></div>'+
      '<div><span>Representação</span><strong>Ilustração esquemática</strong></div></div>'+
      '<button type="button" class="button button-dark" id="dialogWhatsapp">Consultar '+m.name+' ↗</button></div></div>';
    const dialog = el("productDialog");
    dialog.showModal();
    document.body.classList.add("dialog-open");
    el("dialogWhatsapp").addEventListener("click",()=>openWhatsapp("Olá! Vi o "+m.name+" no catálogo da "+CONFIG.storeName+". Gostaria de saber sobre disponibilidade, cores, armazenamento e valores."));
  }
  function closeProduct(){
    const dialog = el("productDialog");
    if(dialog.open)dialog.close();
    document.body.classList.remove("dialog-open");
    activeProduct=null;
  }

  // SIMULAÇÃO ILUSTRATIVA — NÃO SÃO PREÇOS DE MERCADO.
  function fictionalBase(m){
    const baseByYear = {
      2026:4800,2025:3550,2024:2700,2023:2050,2022:1550,2021:1180,2020:880,
      2019:680,2018:490,2017:350,2016:230,2015:155,2014:100
    };
    let base = baseByYear[m.year] || 0;
    if(m.isPro) base *= 1.3;
    if(m.isMax) base *= 1.22;
    if(m.isMini) base *= 0.84;
    if(m.isSE) base *= 0.8;
    if(m.isE) base *= 0.82;
    if(m.fold) base *= 1.55;
    if(m.name==="iPhone Air") base*=1.15;
    return base;
  }
  function tradeEvaluation(){
    const modelName = el("tradeModel").value;
    const m = catalog.find(x=>x.id===modelName);
    if(!m){el("tradeModel").focus();notify("Selecione o modelo do seu iPhone para continuar.");return}
    const storage = Number(el("tradeStorage").value);
    const condition = document.querySelector("input[name=condition]:checked").value;
    const battery = Number(el("tradeBattery").value);
    const screen = el("tradeScreen").value;
    const working = el("tradeWorking").value;
    const accessories = el("tradeAccessories").checked;
    const unlocked = el("tradeUnlocked").checked;
    const common = [
      "Modelo: "+m.name,
      "Armazenamento informado: "+storageLabel(storage),
      "Aparência: "+({excellent:"Excelente",good:"Boa",regular:"Regular"}[condition]),
      "Tela: "+({perfect:"Sem danos",scratched:"Arranhões",cracked:"Danificada"}[screen]),
      "Funcionamento: "+({perfect:"Normal",minor:"Pequeno defeito",major:"Defeito importante"}[working]),
      "Bateria: "+battery+"%",
      "Caixa/acessórios: "+(accessories?"Sim":"Não"),
      "iCloud desvinculado: "+(unlocked?"Sim":"Não")
    ];
    if(!unlocked){
      lastTradeMessage="Olá! Gostaria de orientação sobre avaliação de iPhone. \n"+common.join("\n");
      el("estimateValue").textContent="Sem estimativa";
      el("resultDescription").textContent="É necessário desvincular o iCloud e comprovar a titularidade do aparelho antes de uma avaliação de troca.";
      el("estimateBreakdown").hidden=true;
      el("tradeWhatsapp").href=whatsappURL(lastTradeMessage);
      notify("Sem avaliação para aparelhos vinculados ao iCloud.");
      return;
    }
    if(m.year < 2016){
      lastTradeMessage="Olá! Gostaria de uma análise individual do meu iPhone histórico. \n"+common.join("\n");
      el("estimateValue").textContent="Sob análise";
      el("resultDescription").textContent="Este modelo histórico precisa de avaliação individual. A simulação automática não atribui valor a dispositivos muito antigos.";
      el("estimateBreakdown").hidden=true;
      el("tradeWhatsapp").href=whatsappURL(lastTradeMessage);
      return;
    }
    const multipliers = {
      condition:{excellent:1,good:.86,regular:.67},
      screen:{perfect:1,scratched:.89,cracked:.58},
      working:{perfect:1,minor:.70,major:.34}
    };
    let base=fictionalBase(m);
    const storageFactor = storage === 32 ? .88 : storage === 64 ? .94 : storage === 128 ? 1 : storage === 256 ? 1.1 : storage === 512 ? 1.19 : storage === 1024 ? 1.28 : 1.34;
    const batteryFactor = battery>=90 ? 1 : battery>=85 ? .97 : battery>=80 ? .91 : battery>=75 ? .83 : battery>=65 ? .74 : .62;
    const accessoryFactor = accessories ? 1.02 : .98;
    let amount = base * storageFactor * multipliers.condition[condition] * multipliers.screen[screen] * multipliers.working[working] * batteryFactor * accessoryFactor;
    amount = Math.max(50,Math.round(amount/50)*50);
    const low = Math.max(50,Math.round((amount*.90)/50)*50);
    const high = Math.round((amount*1.10)/50)*50;
    el("estimateValue").textContent=BRL(amount);
    el("resultDescription").textContent="Estimativa de demonstração para "+m.name+". Uma avaliação presencial ou técnica pode alterar totalmente esse valor.";
    el("estimateBreakdown").hidden=false;
    el("estimateBreakdown").innerHTML=
      '<div><span>Modelo selecionado</span><strong>'+m.name+'</strong></div>'+
      '<div><span>Capacidade informada</span><strong>'+storageLabel(storage)+'</strong></div>'+
      '<div><span>Faixa ilustrativa (±10%)</span><strong>'+BRL(low)+' a '+BRL(high)+'</strong></div>';
    lastTradeMessage="Olá! Gostaria de avaliar meu iPhone para troca. Fiz uma SIMULAÇÃO ILUSTRATIVA no site da "+CONFIG.storeName+".\n\n"+common.join("\n")+"\n\nEstimativa fictícia do site: "+BRL(amount)+".\nSei que o valor real depende da análise da loja. Podemos conversar?";
    el("tradeWhatsapp").href=whatsappURL(lastTradeMessage);
    notify("Estimativa ilustrativa calculada.");
  }

  function setup(){
    el("year").textContent=String(new Date().getFullYear());
    tabs.forEach(tab=>tab.addEventListener("click",()=>setFilter(tab.dataset.filter)));
    document.querySelectorAll("[data-feature-filter]").forEach(a=>a.addEventListener("click",()=>{
      search="";el("modelSearch").value="";setFilter(a.dataset.featureFilter);
    }));
    el("modelSearch").addEventListener("input",e=>{search=e.target.value.toLowerCase().trim();limit=12;renderCatalog()});
    el("catalogSort").addEventListener("change",e=>{sort=e.target.value;limit=12;renderCatalog()});
    el("loadMore").addEventListener("click",()=>{limit+=12;renderCatalog()});
    grid.addEventListener("click",e=>{
      const fav=e.target.closest("[data-favorite]");
      if(fav){toggleFavorite(fav.dataset.favorite);return}
      const open=e.target.closest("[data-open]");
      if(open)openProduct(open.dataset.open);
    });
    el("favoriteShortcut").addEventListener("click",()=>{
      search="";el("modelSearch").value="";setFilter("favoritos");
      el("catalogo").scrollIntoView({behavior:"smooth"});
    });
    const dialog=el("productDialog");
    el("dialogClose").addEventListener("click",closeProduct);
    dialog.addEventListener("close",()=>{document.body.classList.remove("dialog-open");activeProduct=null});
    dialog.addEventListener("click",e=>{if(e.target===dialog)closeProduct()});
    el("tradeModel").insertAdjacentHTML("beforeend",catalog.map(m=>'<option value="'+m.id+'">'+m.name+'</option>').join(""));
    el("tradeBattery").addEventListener("input",e=>el("batteryValue").textContent=e.target.value);
    el("tradeForm").addEventListener("submit",e=>{
      e.preventDefault();tradeEvaluation();
    });
    el("tradeWhatsapp").addEventListener("click",e=>{
      if(!lastTradeMessage){e.preventDefault();el("tradeModel").focus();notify("Calcule primeiro a estimativa para conversar sobre sua troca.");return}
      if(!CONFIG.whatsappNumber)notify("WhatsApp de demonstração: configure o número da loja no app.js.");
    });
    const hello="Olá! Visitei a demonstração da "+CONFIG.storeName+". Gostaria de saber mais sobre os modelos disponíveis.";
    el("mainContactButton").href=whatsappURL(hello);
    el("floatingContact").href=whatsappURL(hello);
    el("floatingContact").target="_blank";
    el("floatingContact").rel="noopener noreferrer";
    el("menuToggle").addEventListener("click",()=>{
      const open=el("mainNav").classList.toggle("open");
      el("menuToggle").setAttribute("aria-expanded",String(open));
    });
    el("mainNav").querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
      el("mainNav").classList.remove("open");
      el("menuToggle").setAttribute("aria-expanded","false");
    }));
    renderCatalog();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup);
  else setup();
})();