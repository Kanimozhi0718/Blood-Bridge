/* =========================================================
   MAIN SITE SCRIPT (script1.js)
   Handles: Login page, Home page buttons, Quick Links,
            Donor Registration form, Emergency form, Contact form
   ========================================================= */

/* ---------------- LOGIN PAGE ---------------- */

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("loginEmail");
const password = document.getElementById("loginPassword");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (
            email.value.trim() !== "" &&
            password.value.trim() !== ""
        ) {
            window.location.href = "Home1.html";
        }

    });
}


/* ---------------- SHOW/HIDE LOGIN PASSWORD ---------------- */

const loginShowPasswordCheckbox = document.getElementById("loginShowPassword");
const loginPasswordField = document.getElementById("loginPassword");

if (loginShowPasswordCheckbox && loginPasswordField) {
    loginShowPasswordCheckbox.addEventListener("change", function () {
        loginPasswordField.type = this.checked ? "text" : "password";
    });
}


// ================= HOME PAGE BUTTONS =================

// Register Button
const registerBtn = document.getElementById("registerBtn");

if (registerBtn) {

    registerBtn.addEventListener("click", function () {

        window.location.href = "Donar.html";

    });

}

// Sign Out Button
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        window.location.href = "index.html";
    });
}

// Become a Donor
const becomeDonorBtn = document.getElementById("becomeDonorBtn");

if (becomeDonorBtn) {

    becomeDonorBtn.addEventListener("click", function () {

        window.location.href = "Donor.html";

    });

}

// Find Blood
const findBloodBtn = document.getElementById("findBloodBtn");

if (findBloodBtn) {

    findBloodBtn.addEventListener("click", function () {

        window.location.href = "FindDonar.html";

    });

}

// ================= BLOOD REQUEST BUTTONS =================

const requestButtons = [

    "requestAPlus",
    "requestAMinus",
    "requestBPlus",
    "requestBMinus",
    "requestABPlus",
    "requestABMinus",
    "requestOPlus",
    "requestOMinus"

];

requestButtons.forEach(function(id){

    const button = document.getElementById(id);

    if(button){

        button.addEventListener("click", function(){

            // Future Request Page
            window.location.href = "Admin.html";

        });

    }

});

// ================= QUICK LINKS =================

const homeItem = document.getElementById("homeItem");
if(homeItem){
homeItem.onclick = () => location.href = "Home1.html";
}

const aboutItem = document.getElementById("aboutItem");
if(aboutItem){
aboutItem.onclick = () => location.href = "About1.html";
}

const donateItem = document.getElementById("donateItem");
if(donateItem){
donateItem.onclick = () => location.href = "Donar.html";
}

const findDonorItem = document.getElementById("findDonorItem");
if(findDonorItem){
findDonorItem.onclick = () => location.href = "FindDonar1.html";
}

const emergencyItem = document.getElementById("emergencyItem");
if(emergencyItem){
emergencyItem.onclick = () => location.href = "Emergency1.html";
}

const galleryItem = document.getElementById("galleryItem");
if(galleryItem){
galleryItem.onclick = () => location.href = "Gallery1.html";
}

const blogItem = document.getElementById("blogItem");
if(blogItem){
blogItem.onclick = () => location.href = "blog1.html";
}

const contactItem = document.getElementById("contactItem");
if(contactItem){
contactItem.onclick = () => location.href = "contact1.html";
}


/* =========================================================
   DONOR REGISTRATION (Donar.html)
   ---------------------------------------------------------
   REPLACES the old 3 blocks that used to be here:
     1. showPasswordCheckbox (id "showPassword") change listener
     2. confirmPasswordField real-time match-check listener
     3. donorForm submit listener (old version used alert()
        and did not set an `available` field)

   Saves every registered donor into localStorage key "donors".
   This is the SAME key Admin.js reads/deletes from, and the
   SAME key FindDonar1.html reads from — so:
     - New registration -> instantly shows on Find Donor page
     - Admin marks unavailable / deletes -> instantly disappears
       from Find Donor page
   No extra sync code needed, they all share one source of truth.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const donorForm             = document.getElementById("donorForm");

    // If this page has no donor form, skip everything below
    if (!donorForm) return;

    const passwordField         = document.getElementById("password");
    const confirmPasswordField  = document.getElementById("confirmPassword");
    const showPasswordCheckbox  = document.getElementById("showPassword");
    const passwordError         = document.getElementById("passwordError");

    /* ---------- 1. Show / Hide password ---------- */
    if (showPasswordCheckbox) {
        showPasswordCheckbox.addEventListener("change", function () {
            const type = this.checked ? "text" : "password";
            passwordField.type = type;
            confirmPasswordField.type = type;
        });
    }

    /* ---------- 2. Real-time password match check ---------- */
    if (confirmPasswordField) {
        confirmPasswordField.addEventListener("input", function () {
            const pass = passwordField.value;
            const confirmPass = this.value;

            if (confirmPass && pass !== confirmPass) {
                passwordError.style.display = "block";
            } else {
                passwordError.style.display = "none";
            }
        });
    }

    /* ---------- localStorage helpers ---------- */
    function getDonors() {
        return JSON.parse(localStorage.getItem("donors")) || [];
    }

    function saveDonors(list) {
        localStorage.setItem("donors", JSON.stringify(list));
    }

    /* ---------- small inline success message (no alert()) ---------- */
    function showSuccess(msg) {
        let box = document.getElementById("formSuccessMsg");
        if (!box) {
            box = document.createElement("p");
            box.id = "formSuccessMsg";
            box.style.color = "#1c9e5a";
            box.style.fontWeight = "bold";
            box.style.marginTop = "12px";
            box.style.textAlign = "center";
            donorForm.appendChild(box);
        }
        box.textContent = msg;
    }

    /* ---------- 3. Form submit ---------- */
    donorForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Password match check
        if (passwordField.value !== confirmPasswordField.value) {
            passwordError.style.display = "block";
            confirmPasswordField.classList.add("input-error");
            confirmPasswordField.focus(); // wrong field ku cursor pogum
            return; // wrong na inga stop, form submit aagathu
        } else {
            passwordError.style.display = "none";
            confirmPasswordField.classList.remove("input-error");
        }

        const donor = {
            fullName:     document.getElementById("fullName").value.trim(),
            age:          document.getElementById("age").value.trim(),
            gender:       document.getElementById("gender").value,
            bloodGroup:   document.getElementById("bloodGroup").value,
            mobile:       document.getElementById("mobile").value.trim(),
            email:        document.getElementById("email").value.trim(),
            city:         document.getElementById("city").value.trim(),
            address:      document.getElementById("address").value.trim(),
            weight:       document.getElementById("weight").value.trim(),
            donationDate: document.getElementById("donationDate").value,
            available:    true,                     // <-- Find Donor page uses this
            registeredOn: new Date().toISOString()
        };

        const donors = getDonors();
        donors.push(donor);
        saveDonors(donors);

        donorForm.reset();
        passwordField.type = "password";
        confirmPasswordField.type = "password";
        if (showPasswordCheckbox) showPasswordCheckbox.checked = false;

        showSuccess("✅ Registered successfully! You will now appear on the Find Donor page.");
    });

});


/* ---------------- EMERGENCY FORM (Emergency1.html) ---------------- */

const emergencyForm = document.getElementById("emergencyForm");
if (emergencyForm) {
    emergencyForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const emergencyData = {
            patientName: document.getElementById("patientName").value,
            hospitalName: document.getElementById("hospitalName").value,
            bloodGroup: document.getElementById("bloodGroup").value,
            units: document.getElementById("units").value,
            contact: document.getElementById("contact").value,
            city: document.getElementById("city").value,
            message: document.getElementById("message").value
        };

        let requests = JSON.parse(localStorage.getItem("emergencyRequests")) || [];
        requests.push(emergencyData);
        localStorage.setItem("emergencyRequests", JSON.stringify(requests));

        alert("Emergency Request Submitted Successfully!");

        emergencyForm.reset();

    });
}


/* ---------------- CONTACT FORM (contact1.html) ---------------- */

const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", function(e) {

        e.preventDefault();

        const contact = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            subject: document.getElementById("subject").value,
            message: document.getElementById("message").value
        };

        let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

        contacts.push(contact);

        localStorage.setItem("contacts", JSON.stringify(contacts));

        contactForm.reset();

    });
}