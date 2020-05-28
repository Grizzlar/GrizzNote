let cur=0;

let tagColors = ["orange", "orangered", "#0d9903", "#19b3ad", "#970eb3", "#9c080f", "#467800", "#1f263d"]

let styles = [];

let currentCard;

let cards = [];

let searches = [];

let prevSize = 0;

let edit = 0;

window.onresize = ()=>{
    if(window.innerWidth > 950){
        if(prevSize <= 950){
            fillSearch();
        }
    }
    if(window.innerWidth <= 950){
        if(prevSize > 950){
            fillSearch();
        }
    }
    document.getElementById("spop").style.top = document.getElementById("mainModal").getBoundingClientRect().top+"px";
    document.getElementById("spop").style.minHeight = (window.innerHeight - document.getElementById("mainModal").getBoundingClientRect().top) + "px";
    document.getElementById("clL").style.maxHeight = (window.innerHeight*0.96 - document.getElementsByClassName("searchInput")[0].getBoundingClientRect().height) + "px";
    prevSize = window.innerWidth;
}

function randColor(){
    return tagColors[Math.floor(Math.random()*tagColors.length)];
}

function editTitle(){
    if(document.getElementById("cTT").style.display == "none"){
        titleEdit(0, 0);
        document.getElementById("cTT").style.display = "";
        document.getElementsByClassName("titleInput")[0].style.display = "none";
    }else{
        document.getElementById("cTT").style.display = "none";
        document.getElementsByClassName("titleInput")[0].style.display = "";
        document.getElementsByClassName("titleInput")[0].focus();
        document.getElementsByClassName("titleInput")[0].select();
    }
}

function titleEdit(type, e){
    if(type == 0){
        document.getElementById("cTT").innerText = document.getElementsByClassName("titleInput")[0].value;
        cards[currentCard].title = document.getElementById("cTT").innerText;
        cardModified();
    }else{
        if(e.keyCode == 13){
            editTitle();
        }
    }
}

function searchEdit(box){
    let text = box.value;
    let amount = 0;
    for(let i=0;i<cards.length;i++){
        let cardText = JSON.stringify(cards[i]).replace('title','').replace('tags','').replace('contents','');
        let keywords = text.toLowerCase().split(' ');
        let flag = 0;
        keywords.forEach((txt)=>{
            if(txt == ""){
                return;
            }
            if(cardText.toLowerCase().includes(txt)){
                flag = 1;
            }else{
                flag = 0;
            }
        });
        if(flag == 1){
            amount++;
            searches[i].style.display = "block";
        }else{
            if(keywords.length == 1 && keywords[0] == ""){
                amount++;
                searches[i].style.display = "block";
            }else{
                searches[i].style.display = "none";
            }
        }
    }
    if(amount != 0){
        showRes();
    }else{
        notFoundSearch();
    }
}

function delCont(i, j){
    if(confirm("If you don't have a local save there's no going back.\nAre you sure that you want to delete this content?")){
        cards[currentCard].contents[i].splice(j, 1);
        renderContent(cards[currentCard].contents[cur], cur);
    }
}

function editCont(i, j){
    let doc = document.getElementById('data-'+i+'-'+j);
    let tdoc = document.getElementById('title-'+i+'-'+j);
    if(doc.style.display == "none"){
        doc.parentNode.childNodes[2].childNodes[0].childNodes[0].innerText = "Edit";
        doc.style.display = "";
        let txt = doc.parentNode.childNodes[0].value;
        doc.innerHTML = txt.replace(/(?:\r\n|\r|\n)/g, '<br>');
        let tinp = tdoc.parentNode.childNodes[0];
        tdoc.style.display = "";
        tdoc.innerText = tinp.value;
        cards[currentCard].contents[i][j][tdoc.innerText] = doc.innerHTML;
        if(tdoc.innerText != Object.keys(cards[currentCard].contents[i][j])[0]){
            delete cards[currentCard].contents[i][j][Object.keys(cards[currentCard].contents[i][j])[0]];
        }
        tdoc.parentNode.removeChild(tinp);
        doc.parentNode.removeChild(doc.parentNode.childNodes[0]);
    }else{
        let text = doc.innerHTML;
        let ta = document.createElement("textArea");
        ta.style.resize = "none";
        ta.style.width = "98%";
        ta.style.marginLeft = "1%";
        ta.rows = 5;
        ta.value = text.replace(/<br>/g, '\n');
        doc.style.display = "none";
        doc.parentNode.insertBefore(ta, doc);
        let txt = tdoc.innerText;
        let inp = document.createElement("input");
        inp.type = "text";
        inp.classList.add("titleInput");
        inp.value = txt;
        tdoc.style.display = "none";
        tdoc.parentNode.insertBefore(inp, tdoc);
        document.getElementById("data-0-0").parentNode.childNodes[2].childNodes[0].childNodes[0].innerText = "Apply";
    }
}

function editTag(){
    let seltg = document.getElementsByClassName("selectedTag");
    if(seltg.length){
        edit = 1;
        if(document.getElementsByClassName("tagInput")[0].style.display == "none"){
            document.getElementsByClassName("tagInput")[0].style.display = "";
            document.getElementsByClassName("tagInput")[0].focus();
            document.getElementsByClassName("tagInput")[0].select();
            document.getElementsByClassName("tagInput")[0].value = seltg[0].childNodes[0].innerText;
        }
    }
}

function addNTag(){
    if(document.getElementsByClassName("tagInput")[0].style.display == "none"){
        document.getElementsByClassName("tagInput")[0].style.display = "";
        document.getElementsByClassName("tagInput")[0].value = "";
        document.getElementsByClassName("tagInput")[0].focus();
        document.getElementsByClassName("tagInput")[0].select();
    }else{
        tagAdd(0-edit, 0);
        document.getElementsByClassName("tagInput")[0].style.display = "none";
        if(edit == 1){
            edit = 0;
        }
        document.getElementById("editTagPencil").style.display = "";
        document.getElementById("tagDeleter").style.display = "";
    }
}

function addNCont(){
    if(document.getElementsByClassName("selectedTag").length == 0){
        alert("Please select a tag first. If there are no tags available, you can create one.");
        return;
    }
    if(document.getElementsByClassName("contInput")[0].style.display == "none"){
        document.getElementsByClassName("contInput")[0].style.display = "";
        document.getElementsByClassName("contInput")[0].childNodes[2].focus();
        document.getElementsByClassName("contInput")[0].childNodes[2].select();
    }else{
        document.getElementsByClassName("contInput")[0].style.display = "none";
    }
}

function addContent(){
    document.getElementsByClassName("contInput")[0].style.display = "none";
    let titl = document.getElementsByClassName("contTitleInput")[0].value;
    document.getElementsByClassName("contTitleInput")[0].value = "";
    let cont = document.getElementsByClassName("contInput")[0].childNodes[2].value;
    document.getElementsByClassName("contInput")[0].childNodes[2].value = "";
    let obj = {};
    obj[titl] = cont;
    cards[currentCard].contents[cur].push(obj);
    renderContent(cards[currentCard].contents[cur], cur);
}

function isColor(strColor){
    var s = new Option().style;
    s.color = strColor;
    return s.color == strColor;
}

function tagDel(id){
    if(confirm("If you don't have a local save there's no going back. By deleting the tag, all of the contents associated with it will be deleted as well.\nAre you sure?")){
        cards[currentCard].tags.splice(id, 1);
        cards[currentCard].contents.splice(id, 1);
        if(!cards[currentCard].contents.length){
            cards[currentCard].contents.push([]);
        }
        styles.splice(id, 1);
        let i=0;
        let ret = "";
        cards[currentCard].tags.forEach((elem)=>{
            if(i==cur){
                ret += '<div id="tag'+i.toString()+'" class="cardTag selectedTag" ';
            }else{
                ret += '<div id="tag'+i.toString()+'" class="cardTag" ';
            }
            ret += 'style="background-color: '+elem.color+';"';
            ret += ' onClick="selectTag(this)"><span>';
            ret += elem.name;
            ret += '</span></div>'+"\n";
            i++;
        });
        document.getElementsByClassName("tagPart")[0].innerHTML = ret;
        cardModified();
        if(styles.length <= cur){
            cur = styles.length-1;
            document.getElementById("tag"+cur).classList.add("selectedTag");
        }
        renderContent(cards[currentCard].contents[cur], cur);
    }
}

function tagAdd(type, e){
    if(type == 0){
        if(document.getElementsByClassName("tagInput")[0].value == ""){
            return;
        }
        let regex = /.*\[(.*?)\]/;
        let reg = regex.exec(document.getElementsByClassName("tagInput")[0].value);
        let rcl = randColor();
        let colorChoice = null;
        if(reg != null){
            colorChoice = reg[1];
            if(colorChoice){
                if(isColor(colorChoice)){
                    if(colorChoice == "pink"){
                        rcl = "#e97a8e";
                    }else{
                        rcl = colorChoice;
                    }
                }
                document.getElementsByClassName("tagInput")[0].value = document.getElementsByClassName("tagInput")[0].value.substring(0,document.getElementsByClassName("tagInput")[0].value.length-(2+colorChoice.length));
            }
        }
        document.getElementsByClassName("tagPart")[0].innerHTML += "\n<div id=\"tag"+((cards[currentCard].tags.length != cards[currentCard].contents.length) ? styles.length.toString()-1 : styles.length)+"\" class=\"cardTag\" onClick=\"selectTag(this)\"><span>"+document.getElementsByClassName("tagInput")[0].value+"</span></div>";
        document.getElementsByClassName("tagPart")[0].childNodes[document.getElementsByClassName("tagPart")[0].childNodes.length-1].style.backgroundColor = rcl;
        cards[currentCard].tags.push({
            "name": document.getElementsByClassName("tagInput")[0].value,
            "color": rcl
        });
        if(cards[currentCard].tags.length != cards[currentCard].contents.length){
            cards[currentCard].contents.push([]);
        }else{
            document.getElementById("tag0").classList.add("selectedTag");
            cur = 0;
        }
        cardModified();
        renderContent(cards[currentCard].contents[cards[currentCard].contents.length-1], cards[currentCard].contents.length-1);
    }else if(type == -1){
        if(document.getElementsByClassName("tagInput")[0].value == ""){
            return;
        }
        let regex = /.*\[(.*?)\]/;
        let reg = regex.exec(document.getElementsByClassName("tagInput")[0].value);
        let colorChoice = null;
        let rcl = null;
        if(reg != null){
            colorChoice = reg[1];
            if(colorChoice){
                if(isColor(colorChoice)){
                    if(colorChoice == "pink"){
                        rcl = "#e97a8e";
                    }else{
                        rcl = colorChoice;
                    }
                }
                document.getElementsByClassName("tagInput")[0].value = document.getElementsByClassName("tagInput")[0].value.substring(0,document.getElementsByClassName("tagInput")[0].value.length-(2+colorChoice.length));
            }
        }
        document.getElementsByClassName("selectedTag")[0].innerHTML = "<span>"+document.getElementsByClassName("tagInput")[0].value+"</span>";
        if(rcl != null){
            document.getElementsByClassName("selectedTag")[0].style.backgroundColor = rcl;
            cards[currentCard].tags[document.getElementsByClassName("selectedTag")[0].id.substring(3)].color = rcl;
        }
        cards[currentCard].tags[document.getElementsByClassName("selectedTag")[0].id.substring(3)].name = document.getElementsByClassName("tagInput")[0].value;
        cardModified();
        renderContent(cards[currentCard].contents[cards[currentCard].contents.length-1], cards[currentCard].contents.length-1);
    }else{
        if(e.keyCode == 13){
            addNTag();
        }
    }
}

function selectTag(tg){
    if(document.getElementsByClassName("selectedTag").length != 0){
        document.getElementsByClassName("selectedTag")[0].classList.toggle("selectedTag");
    }
    tg.classList.toggle("selectedTag");
    cur = parseInt(tg.id.substring(3));
    document.getElementsByClassName("dataContainer")[0].innerHTML = styles[cur];
}

function dataTitleShow(elem){
    elem.parentNode.style.backgroundColor = "#404040";
    elem.parentNode.style.cursor = "pointer";
}

function dataTitleHide(elem){
    elem.parentNode.style.backgroundColor = "";
    elem.parentNode.style.cursor = "";
}

function dataShow(elem){
    if(elem.childNodes[1].style.display == "block"){
        if(elem.childNodes[0].childNodes[0].id != ""){
            elem.childNodes[0].childNodes[1].innerHTML = "<i class=\"fa fa-caret-down\" aria-hidden=\"true\"></i>";
            elem.childNodes[1].style.display = "";
        }
    }else{
        elem.childNodes[0].childNodes[1].innerHTML = "<i class=\"fa fa-caret-up\" aria-hidden=\"true\"></i>";
        elem.childNodes[1].style.display = "block";
    }
}

function Popup(){
    fillSearch();
    document.getElementById("spop").style.display = "block";
    document.getElementById("mainModal").style.display = "none";
    document.getElementById("importButton").style.display = "none";
    document.getElementById("exportButton").style.display = "none";
}

function closePopup(){
    document.getElementById("spop").style.display = "none";
    document.getElementById("mainModal").style.display = "block";
    document.getElementById("importButton").style.display = "block";
    document.getElementById("exportButton").style.display = "block";
}

function handleImport(inp){
    let file = inp.files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            if(confirm("Combine the cards that are to be imported with the current ones?")){
                try{
                    let crds = JSON.parse(evt.target.result).cards;
                    cards = cards.concat(crds);
                    parseJSON(JSON.stringify({cards: cards}));
                }catch{
                    alert('The file does not match the specifications.');
                    return;
                }
            }else{
                parseJSON(evt.target.result);
            }
        }
    }
}


function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
  }

function cardModified(){
    let c = renderSearchCard(cards[currentCard], currentCard);
    searches[currentCard] = c;
    fillSearch();
}


//////////////////////////////// RENDERING CARD

function renderTitle(title){
    let ret = '<center><div class="cardTitle"><span class="cardTitleText"><span id="cTT">'+title;
    ret += '</span><input autocomplete="off" onKeyUp="titleEdit(1, event)" class="titleInput" style="display: none;" value="'+title;
    ret += '">'+"\n"+'&nbsp;'+"\n"+'<span class="editPencil" onClick="editTitle()"><i class="fa fa-pencil" id=""></i></span></span></div></center>';
    return ret;
}

function renderTags(tags){
    let ret = '<div class="tagContainer"><div class="tagPart">';
    let i=0;
    tags.forEach((elem)=>{
        if(i==0){
            ret += '<div id="tag0" class="cardTag selectedTag" ';
        }else{
            ret += '<div id="tag'+i.toString()+'" class="cardTag" ';
        }
        ret += 'style="background-color: '+elem.color+';"';
        ret += ' onClick="selectTag(this)"><span>';
        ret += elem.name;
        ret += '</span></div>'+"\n";
        i++;
    });
    ret += '</div><span class="editPencil" onClick="editTag()" style="margin-left: 5px;"><i class="fa fa-pencil" id="editTagPencil"></i></span><span class="addTag" onClick="addNTag()" style="margin-left: 5px;"><i class="fa fa-plus" id=""></i></span></div>';
    ret += '<center><input autocomplete="off" onKeyUp="tagAdd(1, event)" class="tagInput" style="display: none;" placeholder="New tag"></center>';
    return ret;
}

function renderContents(contents){
    styles = [];
    for(let i=0;i<contents.length;i++){
        let tagContent = "<center>";
        for(let j=0;j<contents[i].length;j++){
            let title = Object.keys(contents[i][j])[0];
            let text = contents[i][j][title];
            tagContent += '<div class="dataTitle" onClick="dataShow(this)"><div class="dataTitleCont" onMouseOut="dataTitleHide(this)" onMouseOver="dataTitleShow(this)"><span id="title-'+i+'-'+j+'">';
            tagContent += title;
            tagContent += '</span><span style="float: right;padding-top:2px;"><i class="fa fa-caret-down" aria-hidden="true"></i></span></div><div class="dataText" onClick="event.stopPropagation()"><div class="dataTextCont" id="data-'+i+'-'+j+'">';
            tagContent += text.replace(/(?:\r\n|\r|\n)/g, '<br>');
            tagContent += '</div>';
            tagContent += '<center><div style="margin-top: 1em;margin-bottom: 0.35em;"><span onclick="editCont('+i+', '+j+')" class="editButton">Edit</span>&nbsp;&nbsp;<span onclick="delCont('+i+', '+j+')" class="deleteButton">Delete</span><div></center>';
            tagContent += '</div></div>';
        }
        tagContent += '</center><div id="tagDeleter" style="margin-top: 1.2em; margin-left: 2em;"><span onclick="tagDel('+i+')" class="deleteButton"><i class="fa fa-times"></i>&nbsp;Delete tag</span></div>';
        styles.push(tagContent);
    }
    return styles[0];
}

function renderContent(content, pos){
    let tagContent = "<center>";
    for(let j=0;j<content.length;j++){
        let title = Object.keys(content[j])[0];
        let text = content[j][title];
        tagContent += '<div class="dataTitle" onClick="dataShow(this)"><div class="dataTitleCont" onMouseOut="dataTitleHide(this)" onMouseOver="dataTitleShow(this)"><span id="title-'+cur+'-'+j+'">';
        tagContent += title;
        tagContent += '</span><span style="float: right;padding-top:2px;"><i class="fa fa-caret-down" aria-hidden="true"></i></span></div><div class="dataText" onClick="event.stopPropagation()"><div class="dataTextCont" id="data-'+cur+'-'+j+'">';
        tagContent += text.replace(/(?:\r\n|\r|\n)/g, '<br>');
        tagContent += '</div>';
        tagContent += '<center><div style="margin-top: 1em;margin-bottom: 0.35em;"><span onclick="editCont('+cur+', '+j+')" class="editButton">Edit</span>&nbsp;&nbsp;<span onclick="delCont('+cur+', '+j+')" class="deleteButton">Delete</span><div></center>';
        tagContent += '</div></div>';
    }
    tagContent += '</center><div id="tagDeleter" style="margin-top: 1.2em; margin-left: 2em;"><span onclick="tagDel('+cur+')" class="deleteButton"><i class="fa fa-times"></i>&nbsp;Delete tag</span></div>';
    if(styles.length == pos){
        styles.push(tagContent);
    }else{
        styles[pos] = tagContent;
        if(document.getElementsByClassName("selectedTag").length != 0){
            let tg = document.getElementsByClassName("selectedTag")[0];
            cur = parseInt(tg.id.substring(3));
            if(pos == cur){
                document.getElementsByClassName("dataContainer")[0].innerHTML = styles[cur];
            }
        }
    }
}

function renderSearchCard(card, i){
    let c = document.createElement("div");
    c.id = "cardId"+i;
    c.classList.add("cClass");
    c.onclick = selectCard;
    let sti = document.createElement("span");
    sti.innerText = card.title;
    c.appendChild(sti);
    c.appendChild(document.createElement("br"));
    let sta = document.createElement("span");
    sta.classList.add("spanTag");
    sta.innerText = "Tags:";
    c.appendChild(sta);
    card.tags.forEach((tag)=>{
        let nt = document.createElement("span");
        nt.classList.add("searchT");
        nt.innerText = tag.name;
        nt.style.backgroundColor = tag.color;
        c.appendChild(nt);    
    });
    if(i == currentCard){
        c.style.backgroundColor = "#000";
    }
    return c;
}

function newCard(){
    cards.push({"title":"Title", "tags":[], "contents":[[]]});
    if(searches.length){
        searches[currentCard].style.backgroundColor = "";
    }
    currentCard = cards.length-1;
    let template = renderTitle(cards[currentCard].title);
    template += renderTags(cards[currentCard].tags);
    template += '<div class="dataContainer">';
    template += renderContents(cards[currentCard].contents);
    template += '</div><center>';
    template += '<span class="addContent" onclick="addNCont()"><i class="fa fa-plus" id="" style="padding-top: 0.5em;"></i></span>';
    template += '<div class="contInput" style="display: none;"><input autocomplete="off" class="contTitleInput" placeholder="Title" style="margin-top: 0.4em"> <textarea rows="8" style="margin-top: 0.5em;width: 90%"></textarea><br><div class="cardTag conTag" style="margin-top: 0.5em;background-color: #fff;color: #000;" onClick="addContent()"><span>Add</span></div></div>';
    template += '</center>';
    template += renderButtons();
    document.getElementById("mainModal").innerHTML = template;
    document.getElementById("editTagPencil").style.display = "none";
    document.getElementById("tagDeleter").style.display = "none";
    if(window.innerWidth > 950){
        document.getElementById("mainModal").classList.add("bounceIn");
        document.getElementById("mainModal").addEventListener("webkitAnimationEnd", ()=>{
            document.getElementById("mainModal").classList.remove("bounceIn");
        });
    }
    searches.push(renderSearchCard(cards[currentCard], currentCard));
    fillSearch();
}

function remCard(){
    cards.splice(currentCard, 1);
    searches.splice(currentCard, 1);
    if(cards.length == 0){
        newCard();
    }
    if(currentCard == cards.length){
        currentCard -= 1;
    }
    let template = renderTitle(cards[currentCard].title);
    template += renderTags(cards[currentCard].tags);
    template += '<div class="dataContainer">';
    template += renderContents(cards[currentCard].contents);
    template += '</div><center>';
    template += '<span class="addContent" onclick="addNCont()"><i class="fa fa-plus" id="" style="padding-top: 0.5em;"></i></span>';
    template += '<div class="contInput" style="display: none;"><input autocomplete="off" class="contTitleInput" placeholder="Title" style="margin-top: 0.4em"> <textarea rows="8" style="margin-top: 0.5em;width: 90%"></textarea><br><div class="cardTag conTag" style="margin-top: 0.5em;background-color: #fff;color: #000;" onClick="addContent()"><span>Add</span></div></div>';
    template += '</center>';
    template += renderButtons();
    document.getElementById("mainModal").innerHTML = template;
    if(!cards[currentCard].tags.length){
        document.getElementById("editTagPencil").style.display = "none";
        document.getElementById("tagDeleter").style.display = "none";
    }
    if(window.innerWidth > 950){
        document.getElementById("mainModal").classList.add("bounceIn");
        document.getElementById("mainModal").addEventListener("webkitAnimationEnd", ()=>{
            document.getElementById("mainModal").classList.remove("bounceIn");
        });
    }
    searches[currentCard].style.backgroundColor = "#000";
    fillSearch();
}

function renderSearch(){
    let i = 0;
    cards.forEach((card)=>{
        let c = renderSearchCard(card, i++);
        searches.push(c);
    });
    fillSearch();
}

function showRes(){
    document.getElementById("clL").innerHTML = "";
    document.getElementById("spop").innerHTML = "";
    if(window.innerWidth > 950){
        searches.forEach((c)=>{
            document.getElementById("clL").appendChild(c);
        });
    }else{
        searches.forEach((c)=>{
            document.getElementById("spop").appendChild(c);
        });
    }
}

function fillSearch(){
    document.getElementById("clL").innerHTML = "";
    document.getElementById("spop").innerHTML = "";
    if(window.innerWidth > 950){
        searches.forEach((c)=>{
            if(document.getElementsByClassName("searchInput")[0].value == ""){
                c.style.display = "";
            }
            document.getElementById("clL").appendChild(c);
        });
    }else{
        searches.forEach((c)=>{
            if(document.getElementsByClassName("searchInput")[1].value == ""){
                c.style.display = "";
            }
            document.getElementById("spop").appendChild(c);
        });
    }
}

function notFoundSearch(){
    document.getElementById("clL").innerHTML = "";
    document.getElementById("spop").innerHTML = "";
    let c = document.createElement("div");
    c.classList.add("nClass");
    let s = document.createElement("span");
    s.innerText = "No results...";
    c.appendChild(s);
    if(window.innerWidth > 950){
        document.getElementById("clL").appendChild(c);
    }else{
        document.getElementById("spop").appendChild(c);
    }
}

function selectCard(){
    let id = this.id.substring(6);
    searches[currentCard].style.backgroundColor = "";
    currentCard = id;
    let template = renderTitle(cards[currentCard].title);
    template += renderTags(cards[currentCard].tags);
    template += '<div class="dataContainer">';
    template += renderContents(cards[currentCard].contents);
    template += '</div><center>';
    template += '<span class="addContent" onclick="addNCont()"><i class="fa fa-plus" id="" style="padding-top: 0.5em;"></i></span>';
    template += '<div class="contInput" style="display: none;"><input autocomplete="off" class="contTitleInput" placeholder="Title" style="margin-top: 0.4em"> <textarea rows="8" style="margin-top: 0.5em;width: 90%"></textarea><br><div class="cardTag conTag" style="margin-top: 0.5em;background-color: #fff;color: #000;" onClick="addContent()"><span>Add</span></div></div>';
    template += '</center>';
    template += renderButtons();
    document.getElementById("mainModal").innerHTML = template;
    if(!cards[currentCard].tags.length){
        document.getElementById("editTagPencil").style.display = "none";
        document.getElementById("tagDeleter").style.display = "none";
    }
    if(window.innerWidth > 950){
        document.getElementById("mainModal").classList.add("bounceIn");
        document.getElementById("mainModal").addEventListener("webkitAnimationEnd", ()=>{
            document.getElementById("mainModal").classList.remove("bounceIn");
        });
    }
    cardModified();
    fillSearch();
    if(window.innerWidth <= 950){
        closePopup();
    }
}

function renderButtons(){
    let temp = "<center><br/>";
    temp += "<span class=\"addCard\" onclick=\"newCard()\" style=\"margin-right: 1%;\"><i class=\"fa fa-plus\"></i>&nbsp;&nbsp;Add</span>";
    temp += "<span class=\"removeCard\" onclick=\"remCard()\" style=\"margin-left: 1%;\"><i class=\"fa fa-minus\"></i>&nbsp;&nbsp;Remove</span>";
    temp += "</center>";
    return temp;
}

function parseJSON(data){
    cards = [];
    searches = [];
    let template;
    try{
        let myCard = JSON.parse(data);
        cards = myCard.cards;
        currentCard = 0;
        template = renderTitle(cards[currentCard].title);
        template += renderTags(cards[currentCard].tags);
        template += '<div class="dataContainer">';
        template += renderContents(cards[currentCard].contents);
        template += '</div><center>';
        template += '<span class="addContent" onclick="addNCont()"><i class="fa fa-plus" id="" style="padding-top: 0.5em;"></i></span>';
        template += '<div class="contInput" style="display: none;"><input autocomplete="off" class="contTitleInput" placeholder="Title" style="margin-top: 0.4em"> <textarea rows="8" style="margin-top: 0.5em;width: 90%"></textarea><br><div class="cardTag conTag" style="margin-top: 0.5em;background-color: #fff;color: #000;" onClick="addContent()"><span>Add</span></div></div>';
        template += '</center>';
        template += renderButtons();
        renderSearch();
    }catch{
        alert('The file does not match the specifications.');
        return;
    }
    document.getElementById("mainModal").innerHTML = template;
    if(!cards[currentCard].tags.length){
        document.getElementById("editTagPencil").style.display = "none";
        document.getElementById("tagDeleter").style.display = "none";
    }
    if(window.innerWidth > 950){
        document.getElementById("mainModal").classList.add("bounceIn");
        document.getElementById("mainModal").addEventListener("webkitAnimationEnd", ()=>{
            document.getElementById("mainModal").classList.remove("bounceIn");
        });
    }
}


window.onload = ()=>{
    document.getElementById("spop").style.top = document.getElementById("mainModal").getBoundingClientRect().top+"px";
    document.getElementById("spop").style.minHeight = (window.innerHeight - document.getElementById("mainModal").getBoundingClientRect().top) + "px";
    document.getElementById("clL").style.maxHeight = (window.innerHeight*0.96 - document.getElementsByClassName("searchInput")[0].getBoundingClientRect().height) + "px";
    if(localStorage){
        let a = localStorage.getItem("backUp");
        if(a != null && typeof a != undefined && a != ""){
            if(typeof JSON.parse(a).cards != 'undefined'){
                if(JSON.parse(a).cards.length != 0){
                    parseJSON(a);
                    return;
                }
            }
        }
    }
    parseJSON("{\"cards\": [{\"title\":\"Title\",\"tags\":[{\"name\":\"Tag 1\",\"color\":\"orange\"},{\"name\":\"Tag 2\",\"color\":\"#19b3ad\"}],\"contents\":[[{\"Content 1 title\":\"Content 1\"},{\"Content 2 title\":\"Content 2\"}],[{\"Content for tag 2\":\"Content\"}]]},{\"title\":\"Another one\",\"tags\":[],\"contents\":[[]]}]}");
};

window.onbeforeunload = function() {
    return true;
};

setInterval(()=>{
    localStorage.setItem("backUp", JSON.stringify({cards: cards}));
},10000);

////////////////////////////////////////////