//sekcja globalna zmiennych
let points = 0;
let valueOfClick = 1;
let valueOfAutoMiau = 0;

//sekcja upgrade
let costUpgrade1 = 50;
let costUpgrade2 = 100;

//animacja points
function animatePoints() {
    let el = document.getElementById('Points');
    el.classList.remove('pop');
    void el.offsetWidth; // reset animacji z css by nie bylo problemow z czasem
    el.classList.add('pop');
}

function getPoints(){
    points += valueOfClick;
    document.getElementById('Points').textContent = points;
    animatePoints();
    
}

function buyUpgrade1() {
    if (points >= costUpgrade1) {
        points -= costUpgrade1;
        valueOfClick += 1;
        costUpgrade1 = Math.round(costUpgrade1 * 1.5);
        document.getElementById('Points').textContent = points;
        document.getElementById('valueOfClick').textContent = valueOfClick;
        document.getElementById('cost1').textContent = costUpgrade1;
    }
}

function buyUpgrade2() {
    
    if (points >= costUpgrade2) {
        points -= costUpgrade2;
        valueOfAutoMiau += 1;
        costUpgrade2 = Math.round(costUpgrade2 * 1.75);

        document.getElementById('Points').textContent = points;
        document.getElementById('valueOfAutoMiau').textContent = valueOfAutoMiau;
        document.getElementById('cost2').textContent = costUpgrade2;
    }
}

setInterval(autoMiau, 1000);

function autoMiau() {
    if (valueOfAutoMiau > 0) {
        points += valueOfAutoMiau;
        document.getElementById('Points').textContent = points;
        document.getElementById('valueOfAutoMiau').textContent = valueOfAutoMiau;
        animatePoints();
    }
}