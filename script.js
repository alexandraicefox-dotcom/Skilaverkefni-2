let verkefni = [
    { audkenni: 1, titill: 'Verkefni 1', lokid: true },
    { audkenni: 2, titill: 'verkefni 2', lokid: false },
    { audkenni: 3, titill: 'verkefni 3', lokid: false }
];
let naestaAudkenni = 4;
let virkSia = 'oll';
const form = document.getElementById('verkefnaform');
const inntak = document.getElementById('nyttverkefni');
const listi = document.getElementById('verkefnalisti');

function birtaVerkefni() {
    listi.replaceChildren();
    const synileg = verkefni.filter(function (verkefni) {
        if (virkSia === 'lokid') return verkefni.lokid;
        if (virkSia === 'olokid') return !verkefni.lokid;
        return true;
    });
    synileg.forEach(function (verkefni) {
        const lina = document.createElement('li');
        lina.className = verkefni.lokid ? 'verkefni lokid' : 'verkefni';
        const merking = document.createElement('label');
        const hak = document.createElement('input');
        hak.type = 'checkbox';
        hak.checked = verkefni.lokid;
        hak.addEventListener('change', function () { skiptaStodu(verkefni.audkenni); });
        const titill = document.createElement('span');
        titill.className = 'verkefnisheiti';
        titill.textContent = verkefni.titill;
        merking.append(hak, titill);
        const stada = document.createElement('span');
        stada.className = 'stada';
        stada.textContent = verkefni.lokid ? 'Lokið' : 'Í vinnslu';
        const eyda = document.createElement('button');
        eyda.type = 'button';
        eyda.className = 'eyda';
        eyda.textContent = '×';
        eyda.setAttribute('aria-label', 'Eyða verkefni: ' + verkefni.titill);
        eyda.addEventListener('click', function () { eydaVerkefni(verkefni.audkenni); });
        lina.append(merking, stada, eyda);
        listi.append(lina);
    });
    document.getElementById('tomur-listi').hidden = synileg.length > 0;
    document.getElementById('synilegur-fjoldi').textContent = synileg.length + ' sýnd';
}

function uppfaeraTolfraedi() {
    const lokin = verkefni.filter(function (verkefni) { return verkefni.lokid; }).length;
    const hlutfall = verkefni.length === 0 ? 0 : Math.round(lokin / verkefni.length * 100);
    document.getElementById('heildarfjoldi').textContent = verkefni.length;
    document.getElementById('lokinfjoldi').textContent = lokin;
    document.getElementById('olokinfjoldi').textContent = verkefni.length - lokin;
    document.getElementById('framvindutexti').textContent = hlutfall + '% lokið';
    document.getElementById('framvindustika').value = hlutfall;
}

function uppfaeraSidu() {
    birtaVerkefni();
    uppfaeraTolfraedi();
}

function baetaVidVerkefni(titill) {
    verkefni.push({ audkenni: naestaAudkenni++, titill: titill, lokid: false });
    if (virkSia === 'lokid') veljaSiu('oll');
    uppfaeraSidu();
    document.getElementById('tilkynning').textContent = 'Verkefni bætt við: ' + titill;
}

function skiptaStodu(audkenni) {
    const val = verkefni.find(function (verkefni) { return verkefni.audkenni === audkenni; });
    if (val) {
        val.lokid = !val.lokid;
        uppfaeraSidu();

        const stadsetning = verkefni.filter(function (verkefni) {
            return virkSia === 'oll' || (virkSia === 'lokid' ? verkefni.lokid : !verkefni.lokid);
        }).findIndex(function (verkefni) { return verkefni.audkenni === audkenni; });
        const hak = listi.querySelectorAll('input');
        if (hak[stadsetning]) hak[stadsetning].focus();
        else document.querySelector('.siur .valin').focus();
    }
}

function eydaVerkefni(audkenni) {
    verkefni = verkefni.filter(function (verkefni) { return verkefni.audkenni !== audkenni; });
    uppfaeraSidu();
    document.getElementById('tilkynning').textContent = 'Verkefni eytt.';
    inntak.focus();
}

function veljaSiu(sia) {
    virkSia = sia;
    document.querySelectorAll('[data-sia]').forEach(function (takki) {
        const valin = takki.dataset.sia === sia;
        takki.classList.toggle('valin', valin);
        takki.setAttribute('aria-pressed', String(valin));
    });
    birtaVerkefni();
}

form.addEventListener('submit', function (atburdur) {
    atburdur.preventDefault();
    const titill = inntak.value.trim();
    if (titill === '') {
        inntak.setCustomValidity('Skrifaðu heiti verkefnis.');
        inntak.reportValidity();
        return;
    }
    baetaVidVerkefni(titill);
    form.reset();
    inntak.focus();
});
inntak.addEventListener('input', function () { inntak.setCustomValidity(''); });
document.querySelectorAll('[data-sia]').forEach(function (takki) {
    takki.addEventListener('click', function () { veljaSiu(takki.dataset.sia); });
});
uppfaeraSidu();