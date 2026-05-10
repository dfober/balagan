class inscription {
    fMonths = [ '', 'Janv.', 'Fév.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juill.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
    fState = {
        stage: null,
        option : null,
        tarif : 0
    };

    //-----------------------------------------------------
    constructor(type, stage) {
        if (!type) type = 0;
        if (!stage) stage = 0;
        let reg = localStorage.getItem('reg');
        if (reg) {
            reg = JSON.parse(reg);
        console.log ("localStorage", reg)
            // if (!type) type = reg.type;
            // if (!stage) stage = reg.stage;
            document.getElementById('lastname').value = reg.nom;
            document.getElementById('firstname').value = reg.prenom;
            document.getElementById('phone').value = reg.tel;
            document.getElementById('email').value = reg.email;
            document.getElementById('address').value = reg.adresse;
            document.getElementById('instr').value = reg.instrument;
            document.getElementById('rem').value = reg.remarques;
        }
        this.makeTypeMenu ( gData, type );
        this.typeSelect(type, stage);
    }

    //-----------------------------------------------------
    submit() {
        let niv = document.getElementById('niveau');
        let data = {
            nom: document.getElementById('lastname').value,
            prenom: document.getElementById('firstname').value,
            tel: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            adresse: document.getElementById('address').value,
            instrument: document.getElementById('instr').value,
            remarques: document.getElementById('rem').value,
            type: document.getElementById('menu1').selectedIndex,
            stage: document.getElementById('menu2').selectedIndex,
            niveau: niv.options[niv.selectedIndex].text,
        }
        localStorage.setItem ('reg', JSON.stringify(data));
console.log ("submit", JSON.stringify(data), this.fState.stage)
    }

    //-----------------------------------------------------
    makeOptions(data, options=null) {
        let a = data.header.options.indiv;
        let b = data.header.options.camping;
        if (options) {
            a += ' (' + options.indiv + ' €)'
            b += ' (' + options.camping + ' €)'
        }
        document.getElementById('optalabel').innerHTML = a;
        document.getElementById('optblabel').innerHTML = b;
    }

    //-----------------------------------------------------
    makeTarif(data, stage) {
        let a = data.header.prix;
        let b = data.header.reduit;
        if (stage) {
            a += ' (' + stage.prix + ' €)'
            b += ' (' + stage.reduit + ' €)'
        }
        document.getElementById('fulllabel').innerHTML = a;
        document.getElementById('reduitlabel').innerHTML = b;
    }

    //-----------------------------------------------------
    makeTotal (state) {
        if (state.stage.options == null) return;

        let t = document.getElementById ('total');
        let total = parseInt( state.tarif == 'F' ?  state.stage.prix : state.stage.reduit);
        if (state.option != null) {
            total += parseInt( state.option == 'A' ?  state.stage.options.indiv : state.stage.options.camping);
        }
        t.innerHTML = "Total : " + total + "€";
        t.classList.remove("d-none");
    }

    //-----------------------------------------------------
    // call by onclick
    tarif(value) {
        let t = document.getElementById (value=='F' ? 'full' : 'reduit');
        this.fState.tarif = value;
        this.makeTotal(this.fState)
    }

    //-----------------------------------------------------
    // call by onclick
    option(value) {
        let opt = document.getElementById (value=='A' ? 'opta' : 'optb');
        if (value == this.fState.option) {
            opt.checked = false;
            this.fState.option = null;
        }
        else this.fState.option = value;
        this.makeTotal(this.fState)
    }

    //-----------------------------------------------------
    // call by onchange
    typeSelect (index, stage=0) {
//        console.log ("typeSelect", index, stage);
        this.makeStagesMenu (gData.sections[index].stages);
        if (stage) this.stageSelect(stage);
    }

    //-----------------------------------------------------
    // call by onchange
    stageSelect (index) {
        let section = document.getElementById('menu1').value;
        let smenu = document.getElementById('menu2');
        if (smenu.options[index].disabled) index=0;
        if (index > 0) {
            let stage = gData.sections[section].stages[index-1];
            console.log ("stageSelect", index, stage);
            document.getElementById ('full').checked = true;
            document.getElementById('titre').innerHTML = stage.title.length ? stage.title : "";
            this.fState.stage = stage;
            this.fState.tarif = 'F';
            this.makeTarifSection(gData, stage);
            this.makeTotal(this.fState);
        }
        else this.reset()
        smenu.selectedIndex = index;
    }

    //-----------------------------------------------------
    makeTarifSection (data, stage) {
        this.makeTarif (data, stage);

        let options = document.getElementById("options");
        if (stage.options) {
            this.makeOptions(gData, stage.options);
            options.classList.remove("d-none");
        }
        else options.classList.add("d-none");
        document.getElementById("prix").classList.remove("d-none");
    }

    //-----------------------------------------------------
    reset() {
        document.getElementById("prix").classList.add("d-none");
        document.getElementById("options").classList.add("d-none");
        document.getElementById("total").classList.add("d-none");
        document.getElementById ('opta').checked = false;
        document.getElementById ('optb').checked = false;
        document.getElementById('titre').innerHTML = "";
        this.fState.stage = null;
        this.fState.option = null;
    }

    //-----------------------------------------------------
    toString(date, day= false) {
        let s = date.split('/');
        return day ? s[0] : s[0] + " " + this.fMonths[parseInt(s[1])];
    }

    //-----------------------------------------------------
    beforeNow (date) {
        let s = date.split('/');
        let d = new Date(s[2]+"-"+s[1]+"-"+s[0]);
        let now = new Date();
        return d.getTime() < now.getTime();
    }

    //-----------------------------------------------------
    makeDates (start, end) {
        let s = start.split('/');
        let e = end.split('/');
        if (s[1] == e[1]) return this.toString(start, true) + " - " + this.toString(end);
        return this.toString(start) + " - " + this.toString(end);
    }

    //-----------------------------------------------------
    makeStagesMenu (data) {
        let menu = document.getElementById('menu2');
        menu.innerHTML = '';
        let i = 1;
        this.addOption (menu, null, "Choisir");
        data.forEach(item => {
            let option = item.anim.trim() + " (" + this.makeDates(item.start, item.end ) + ")";
            this.addOption (menu, i++, option, this.beforeNow(item.start));
        })
        this.stageSelect(0);
    }

    //-----------------------------------------------------
    makeTypeMenu (data, type) {
        let menu = document.getElementById('menu1');
        menu.innerHTML = '';
        let i = 0;
        data.sections.forEach(item => {
            this.addOption (menu, i++, item.title);
        })
        menu.selectedIndex = type;
    }

    //-----------------------------------------------------
    addOption(menu, index, option, disable=false) {
        let opt = document.createElement('option');
        opt.value = (index != null) ? index : "";
        opt.innerHTML = option;
        if (disable) opt.disabled = true;
        menu.appendChild(opt);
    }

};

//-----------------------------------------------------
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var gInscr = new inscription (getParameterByName('t'), getParameterByName('s'));
