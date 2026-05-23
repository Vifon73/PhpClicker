let points = 0;
let valueOfClick = 1;
let valueOfAutoMiau = 0;

let criticalChance = 0;
let criticalMultiplier = 1;
let comboMultiplier = 1;
let comboStreak = 0;
let comboResetTimer = null;

const COMBO_RESET_TIME = 5000;
const COMBO_INCREMENT = 0.05;

let costUpgrade1 = 50;
let costUpgrade2 = 100;
let costUpgrade3 = 500;
let costUpgrade4 = 1200;
let costUpgrade5 = 1500;
let costUpgrade6 = 1800;
let costUpgrade7 = 800;
let costUpgrade8 = 800;
let costUpgrade9 = 2000;

let authMode = 'login';

function toggleAuthMode() {
    authMode = authMode === 'login' ? 'register' : 'login';
    document.getElementById('AuthTitle').textContent =
        authMode === 'login' ? 'Logowanie' : 'Rejestracja';
    document.getElementById('AuthSubmitBtn').textContent =
        authMode === 'login' ? 'Zaloguj się' : 'Zarejestruj się';
    document.getElementById('AuthSwitchLink').textContent =
        authMode === 'login' ? 'Zarejestruj się' : 'Mam już konto';
    document.querySelector('.auth-switch').firstChild.textContent =
        authMode === 'login' ? 'Nie masz konta? ' : 'Masz już konto? ';
    document.getElementById('AuthError').textContent = '';
}

async function submitAuth() {
    const username = document.getElementById('AuthUsername').value.trim();
    const password = document.getElementById('AuthPassword').value;
    const errorEl = document.getElementById('AuthError');

    if (!username || !password) {
        errorEl.textContent = 'Wypełnij oba pola.';
        return;
    }

    const body = new URLSearchParams({ action: authMode, username, password });
    const res = await fetch('auth.php', { method: 'POST', body });
    const data = await res.json();

    if (!data.success) {
        errorEl.textContent = data.message;
        return;
    }

    document.getElementById('AuthModal').style.display = 'none';
    document.getElementById('UserBar').style.display = 'flex';
    document.getElementById('UserBarName').textContent = data.username;

    await loadGame();
}

async function logout() {
    await saveGame();
    await fetch('auth.php', {
        method: 'POST',
        body: new URLSearchParams({ action: 'logout' })
    });
    resetGame();
    document.getElementById('AuthModal').style.display = 'flex';
    document.getElementById('UserBar').style.display = 'none';
    document.getElementById('AuthUsername').value = '';
    document.getElementById('AuthPassword').value = '';
    document.getElementById('AuthError').textContent = '';
}

function resetGame() {
    points = 0;
    valueOfClick = 1;
    valueOfAutoMiau = 0;
    criticalChance = 0;
    criticalMultiplier = 1;
    comboMultiplier = 1;
    comboStreak = 0;
    costUpgrade1 = 50;
    costUpgrade2 = 100;
    costUpgrade3 = 500;
    costUpgrade4 = 1200;
    costUpgrade5 = 1500;
    costUpgrade6 = 1800;
    costUpgrade7 = 800;
    costUpgrade8 = 800;
    costUpgrade9 = 2000;
    updateAllUI();
}

async function saveGame() {
    const body = new URLSearchParams({
        action: 'save',
        points: points,
        value_of_click: valueOfClick,
        value_of_auto: valueOfAutoMiau,
        critical_chance: criticalChance,
        critical_multiplier: criticalMultiplier,
        combo_multiplier: comboMultiplier,
        cost_upgrade1: costUpgrade1,
        cost_upgrade2: costUpgrade2,
        cost_upgrade3: costUpgrade3,
        cost_upgrade4: costUpgrade4,
        cost_upgrade5: costUpgrade5,
        cost_upgrade6: costUpgrade6,
        cost_upgrade7: costUpgrade7,
        cost_upgrade8: costUpgrade8,
        cost_upgrade9: costUpgrade9,
    });

    const res = await fetch('game.php', { method: 'POST', body });
    const data = await res.json();

    if (data.success) {
        flashSaveBtn();
    } else {
        alert('Błąd zapisu: ' + data.message);
    }
}

function flashSaveBtn() {
    const btn = document.getElementById('SaveBtn');
    btn.textContent = 'Zapisano!';
    setTimeout(function() { btn.textContent = 'Zapisz'; }, 1500);
}

async function loadGame() {
    const res = await fetch('game.php?action=load');
    const data = await res.json();

    if (!data.success) return;

    const s = data.save;
    points = parseInt(s.points);
    valueOfClick = parseInt(s.value_of_click);
    valueOfAutoMiau = parseInt(s.value_of_auto);
    criticalChance = parseFloat(s.critical_chance) || 0;
    criticalMultiplier = parseFloat(s.critical_multiplier) || 1;
    comboMultiplier = parseFloat(s.combo_multiplier) || 1;
    costUpgrade1 = parseInt(s.cost_upgrade1);
    costUpgrade2 = parseInt(s.cost_upgrade2);
    costUpgrade3 = parseInt(s.cost_upgrade3);
    costUpgrade4 = parseInt(s.cost_upgrade4);
    costUpgrade5 = parseInt(s.cost_upgrade5);
    costUpgrade6 = parseInt(s.cost_upgrade6);
    costUpgrade7 = parseInt(s.cost_upgrade7);
    costUpgrade8 = parseInt(s.cost_upgrade8);
    costUpgrade9 = parseInt(s.cost_upgrade9);

    updateAllUI();
}

function updateAllUI() {
    document.getElementById('Points').textContent = points;
    document.getElementById('valueOfClick').textContent = valueOfClick;
    document.getElementById('valueOfAutoMiau').textContent = valueOfAutoMiau;
    document.getElementById('criticalChanceDisplay').textContent = criticalChance.toFixed(1);
    document.getElementById('criticalMultiplierDisplay').textContent = criticalMultiplier.toFixed(2);
    document.getElementById('comboMultiplierDisplay').textContent = comboMultiplier.toFixed(2);
    document.getElementById('cost1').textContent = costUpgrade1;
    document.getElementById('cost2').textContent = costUpgrade2;
    document.getElementById('cost3').textContent = costUpgrade3;
    document.getElementById('cost4').textContent = costUpgrade4;
    document.getElementById('cost5').textContent = costUpgrade5;
    document.getElementById('cost6').textContent = costUpgrade6;
    document.getElementById('cost7').textContent = costUpgrade7;
    document.getElementById('cost8').textContent = costUpgrade8;
    document.getElementById('cost9').textContent = costUpgrade9;
}

function animatePoints() {
    const el = document.getElementById('Points');
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
}

function resetComboTimer() {
    if (comboResetTimer) clearTimeout(comboResetTimer);
    comboResetTimer = setTimeout(() => {
        comboStreak = 0;
        comboMultiplier = 1;
        updateAllUI();
    }, COMBO_RESET_TIME);
}

function getPoints() {
    let damageMultiplier = 1;
    const isCritical = Math.random() * 100 < criticalChance;

    if (isCritical) {
        damageMultiplier = criticalMultiplier;
        showCriticalHit();
    }

    comboStreak++;
    comboMultiplier = 1 + (comboStreak * COMBO_INCREMENT);
    resetComboTimer();

    const baseDamage = valueOfClick;
    const finalDamage = Math.round(baseDamage * damageMultiplier * comboMultiplier);

    points += finalDamage;
    document.getElementById('Points').textContent = points;
    animatePoints();
    updateAllUI();
}

function showCriticalHit() {
    const btn = document.getElementById('ClickBtn');
    btn.classList.add('critical-hit');
    setTimeout(() => btn.classList.remove('critical-hit'), 300);
}

function buyUpgrade1() {
    if (points >= costUpgrade1) {
        points -= costUpgrade1;
        valueOfClick += 1;
        costUpgrade1 = Math.round(costUpgrade1 * 1.5);
        updateAllUI();
    }
}

function buyUpgrade2() {
    if (points >= costUpgrade2) {
        points -= costUpgrade2;
        valueOfAutoMiau += 1;
        costUpgrade2 = Math.round(costUpgrade2 * 1.75);
        updateAllUI();
    }
}

function buyUpgrade3() {
    if (points >= costUpgrade3) {
        points -= costUpgrade3;
        valueOfClick += 5;
        costUpgrade3 = Math.round(costUpgrade3 * 2);
        updateAllUI();
    }
}

function buyUpgrade4() {
    if (points >= costUpgrade4) {
        points -= costUpgrade4;
        criticalChance += 5;
        costUpgrade4 = Math.round(costUpgrade4 * 1.8);
        updateAllUI();
    }
}

function buyUpgrade5() {
    if (points >= costUpgrade5) {
        points -= costUpgrade5;
        criticalMultiplier += 0.5;
        costUpgrade5 = Math.round(costUpgrade5 * 1.9);
        updateAllUI();
    }
}

function buyUpgrade6() {
    if (points >= costUpgrade6) {
        points -= costUpgrade6;
        costUpgrade6 = Math.round(costUpgrade6 * 2);
        updateAllUI();
    }
}

function buyUpgrade7() {
    if (points >= costUpgrade7) {
        points -= costUpgrade7;
        valueOfClick = Math.round(valueOfClick * 1.1);
        costUpgrade7 = Math.round(costUpgrade7 * 2);
        updateAllUI();
    }
}

function buyUpgrade8() {
    if (points >= costUpgrade8) {
        points -= costUpgrade8;
        valueOfAutoMiau = Math.round(valueOfAutoMiau * 1.1) + 1;
        costUpgrade8 = Math.round(costUpgrade8 * 2);
        updateAllUI();
    }
}

function buyUpgrade9() {
    if (points >= costUpgrade9) {
        points -= costUpgrade9;
        valueOfClick = Math.round(valueOfClick * 1.1);
        valueOfAutoMiau = Math.round(valueOfAutoMiau * 1.1) + 1;
        costUpgrade9 = Math.round(costUpgrade9 * 2.5);
        updateAllUI();
    }
}


setInterval(function() {
    if (valueOfAutoMiau > 0) {
        points += valueOfAutoMiau;
        document.getElementById('Points').textContent = points;
        animatePoints();
    }
}, 1000);

setInterval(function() {
    if (document.getElementById('AuthModal').style.display === 'none') {
        saveGame();
    }
}, 30000);
