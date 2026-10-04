function isReversed() {
    return Math.random() < 0.5;
}

function shuffledDeck() {
    var cards = tarotDeck.slice();

    var i;
    var j;
    var temp;

    for (i = cards.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));

        temp = cards[i];
        cards[i] = cards[j];
        cards[j] = temp;
    }

    return cards;
}

function setCardOrientation(img, reversed) {
    if (reversed) {
        img.style.webkitTransform = "rotate(180deg)";
        img.style.transform = "rotate(180deg)";
    } else {
        img.style.webkitTransform = "rotate(0deg)";
        img.style.transform = "rotate(0deg)";
    }
}

// ##############################
// Single Card Reading
// ##############################

var currentSingleCard = null;

function drawOne() {
    var cards = shuffledDeck();

    currentSingleCard = {
        card: cards[0],
        reversed: isReversed(),
        revealed: false
    };

    var html =
        "<div class=\"single-reading\">" +

            "<h2>Single Card Reading</h2>" +

            "<div class=\"reveal-card\" onclick=\"handleSingleCardTap()\">" +

                "<img id=\"single-card-image\" " +
                    "class=\"single-card-image\" " +
                    "src=\"cards/card_back.png\" " +
                    "alt=\"Card back\">" +

                "<div id=\"single-tap-hint\" class=\"tap-hint\">" +
                    "Tap to reveal" +
                "</div>" +

            "</div>" +

            "<div id=\"single-card-details\" " +
                "class=\"single-card-details\"></div>" +

            "<div class=\"reading-actions\">" +
                "<div class=\"action-button\">" +
                    "<button onclick=\"drawOne()\">Redraw</button>" +
                "</div>" +
                "<div class=\"action-button\">" +
                    "<button onclick=\"showHome()\">Back to Home</button>" +
                "</div>" +
            "</div>" +

        "</div>";

    showReading(html);
}

function handleSingleCardTap() {
    var result = currentSingleCard;

    if (!result.revealed) {
        result.revealed = true;
    } else {
        result.reversed = !result.reversed;
    }

    updateSingleCardDisplay();
}

function updateSingleCardDisplay() {
    var result = currentSingleCard;

    var img = document.getElementById("single-card-image");
    var hint = document.getElementById("single-tap-hint");
    var details = document.getElementById("single-card-details");

    img.src = result.card.image;

    setCardOrientation(img, result.reversed);

    if (hint) {
        hint.style.display = "none";
    }

    var meaning;

    if (result.reversed) {
        meaning = result.card.reversed;
    } else {
        meaning = result.card.upright;
    }

    details.innerHTML =
        "<h3>" +
            result.card.name +
            (result.reversed ? " (R)" : "") +
        "</h3>" +
        "<p>" + meaning + "</p>" +
        "<div class=\"tap-hint\">Tap card to reverse</div>";
}

function revealSingleCard() {
    var result = currentSingleCard;

    var img = document.getElementById("single-card-image");
    var hint = document.getElementById("single-tap-hint");
    var details = document.getElementById("single-card-details");

    img.src = result.card.image;

    if (result.reversed) {
        img.className += " reversed-card";
    }

    hint.style.display = "none";

    details.innerHTML =
        "<h3>" +
            result.card.name +
            (result.reversed ? " (R)" : "") +
        "</h3>" +
        "<p>" + result.card.upright + "</p>";
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// ##############################
// Three Card Spread
// ##############################

function buildThreeCard(position, index) {
    return (
        "<div class=\"three-card-column\">" +

            "<h3>" + position + "</h3>" +

            "<div class=\"reveal-card\" " +
                "onclick=\"revealSpreadCard(" + index + ")\">" +

                "<img id=\"spread-card-" + index + "\" " +
                    "class=\"three-card-image\" " +
                    "src=\"cards/card_back.png\" " +
                    "alt=\"Card back\">" +

                "<div id=\"spread-hint-" + index + "\" " +
                    "class=\"tap-hint\">" +
                    "Tap to reveal" +
                "</div>" +

            "</div>" +

            "<div id=\"spread-details-" + index + "\" " +
                "class=\"spread-details\"></div>" +

        "</div>"
    );
}

function drawThree() {
    var cards = shuffledDeck();

    currentSpread = [
        {
            card: cards[0],
            reversed: isReversed(),
            revealed: false
        },
        {
            card: cards[1],
            reversed: isReversed(),
            revealed: false
        },
        {
            card: cards[2],
            reversed: isReversed(),
            revealed: false
        }
    ];
    var html =
        "<div class=\"three-reading\">" +

            "<h2>Three Card Reading</h2>" +

            "<div class=\"three-card-row\">" +

                buildThreeCard("Past", 0) +
                buildThreeCard("Present", 1) +
                buildThreeCard("Future", 2) +

            "</div>" +

            "<div class=\"reading-actions\">" +
                "<div class=\"action-button\">" +
                    "<button onclick=\"drawThree()\">Redraw</button>" +
                "</div>" +
                "<div class=\"action-button\">" +
                    "<button onclick=\"showHome()\">Back to Home</button>" +
                "</div>" +
            "</div>" +

        "</div>";

    showReading(html);
}

function revealSpreadCard(index) {
    var result = currentSpread[index];

    if (!result.revealed) {
        result.revealed = true;
    } else {
        result.reversed = !result.reversed;
    }

    updateSpreadCardDisplay(index);
}

function updateSpreadCardDisplay(index) {
    var result = currentSpread[index];

    var img = document.getElementById("spread-card-" + index);
    var hint = document.getElementById("spread-hint-" + index);
    var details = document.getElementById("spread-details-" + index);

    img.src = result.card.image;

    setCardOrientation(img, result.reversed);

    if (hint) {
        hint.style.display = "none";
    }

    var meaning;

    if (result.reversed) {
        meaning = result.card.reversed;
    } else {
        meaning = result.card.upright;
    }

    details.innerHTML =
        "<h4>" +
            result.card.name +
            (result.reversed ? " (R)" : "") +
        "</h4>" +
        "<p>" + meaning + "</p>";
}

function showReading(html) {
    var home = document.getElementById("home");
    var reading = document.getElementById("reading");

    if (!home) {
        console.error("Could not find #home");
        return;
    }

    if (!reading) {
        console.error("Could not find #reading");
        return;
    }

    home.style.display = "none";

    reading.innerHTML = html;
    reading.style.display = "block";
}


function showHome() {
    var home = document.getElementById("home");
    var reading = document.getElementById("reading");

    reading.style.display = "none";
    home.style.display = "block";
}