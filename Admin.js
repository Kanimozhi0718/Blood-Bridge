const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";
 
// Grabbing all the HTML elements we need for login 
const adminLoginSection = document.getElementById("adminLoginSection");
const adminDashboardSection = document.getElementById("adminDashboardSection");
const adminLoginForm = document.getElementById("adminLoginForm");
const adminLoginError = document.getElementById("adminLoginError");
 
// Function to SHOW the dashboard and HIDE the login form
function showDashboard() {
    adminLoginSection.style.display = "none";
    adminDashboardSection.classList.add("show");
 
    // As soon as dashboard opens, load fresh data into all tabs
    refreshAllData();
}
 
// Function to SHOW the login form and HIDE the dashboard
function showLogin() {
    adminDashboardSection.classList.remove("show");
    adminLoginSection.style.display = "flex";
}
 if (sessionStorage.getItem("adminLoggedIn") === "true") {
    showDashboard();
}
 // When admin clicks "Login to Dashboard" button
adminLoginForm.addEventListener("submit", function (e) {
    e.preventDefault(); // stop page from refreshing on form submit
 
    // Read what admin typed in the input boxes in login form
    const enteredUser = document.getElementById("adminUser").value.trim();
    const enteredPass = document.getElementById("adminPass").value.trim();
 
    // Check if it matches our hardcoded admin credentials
    if (enteredUser === ADMIN_USER && enteredPass === ADMIN_PASS) {
        sessionStorage.setItem("adminLoggedIn", "true"); // remember login
        adminLoginError.textContent = "";                // clear old error
        adminLoginForm.reset();                           // clear input boxes
        showDashboard();
    } else {
        adminLoginError.textContent = "Invalid username or password";
    }
});
 
// When admin clicks "Sign Out"
document.getElementById("adminLogoutBtn").addEventListener("click", function () {
    sessionStorage.removeItem("adminLoggedIn");
    showLogin();
});
 
 
/* =========================================================
   STEP 2: SHOW / HIDE PASSWORD ON LOGIN SCREEN
   ========================================================= */
 
const adminShowPasswordCheckbox = document.getElementById("adminShowPassword");
const adminPassField = document.getElementById("adminPass");
 
if (adminShowPasswordCheckbox && adminPassField) {
    adminShowPasswordCheckbox.addEventListener("change", function () {
        
        if (this.checked) {
            adminPassField.type = "text";
        } else {
            adminPassField.type = "password";
        }
    });
}
 
 
/* =========================================================
   STEP 3: SIDEBAR TAB SWITCHING (Overview / Donors / Emergency / Messages)
   ========================================================= */
 
const navButtons = document.querySelectorAll(".admin-nav-btn");
const tabContents = document.querySelectorAll(".admin-tab-content");
const adminPageTitle = document.getElementById("adminPageTitle");
 
// Nice readable title for each tab
const tabTitles = {
    overview: "Overview",
    donors: "Donors",
    emergency: "Emergency Requests",
    messages: "Contact Messages"
};
 
// Loop through every sidebar button and add a click event  //Sidebar la irukkura ovvoru button-kum indha code run aagum.
navButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
 
        // Step A: remove "active" class from ALL buttons
        navButtons.forEach(function (otherBtn) {
            otherBtn.classList.remove("active"); 
        });
 
        // Step B: add "active" class to the button just clicked
        btn.classList.add("active"); 
 
        // Step C: find which tab this button represents (donors/overview/etc)
        const selectedTab = btn.getAttribute("data-tab");
 
        // Step D: hide all tab sections, then show only the matching one
        tabContents.forEach(function (section) {
            if (section.id === "tab-" + selectedTab) {
                section.classList.add("active");
            } else {
                section.classList.remove("active");
            }
        });
 
        // Step E: update the page heading text
        adminPageTitle.textContent = tabTitles[selectedTab];
 
        // Step F: on mobile, close the sidebar after picking a tab
        document.getElementById("adminSidebar").classList.remove("open");
    });
});
 
// Hamburger menu button (mobile view) opens/closes sidebar
document.getElementById("adminMenuToggle").addEventListener("click", function () {
    document.getElementById("adminSidebar").classList.toggle("open");
});
 
 
/* =========================================================
   STEP 4: TOAST NOTIFICATION (small popup message, bottom-right)
   Used instead of alert() because alert() looks ugly & blocks the page
   ========================================================= */
 
let toastTimer; // holds the timer so we can cancel/reset it
 
function showToast(message, type) {
    const toast = document.getElementById("adminToast");
 
    // choose the correct icon based on success/error
    const icon = (type === "error") ? "bi-x-circle-fill" : "bi-check-circle-fill";
 
    toast.innerHTML = "<i class='bi " + icon + "'></i><span>" + message + "</span>";
    toast.className = "admin-toast show " + (type || "success");
 
    // hide the toast automatically after 2.6 seconds
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
        toast.classList.remove("show");
    }, 2600);
}
 
 
/* =========================================================
   STEP 5: CUSTOM CONFIRM POPUP (used before deleting anything)
   We avoid the browser's built-in confirm() box, and build our own.
   ========================================================= */
 
const confirmOverlay = document.getElementById("adminConfirmOverlay");
const confirmText = document.getElementById("adminConfirmText");
const confirmOkBtn = document.getElementById("adminConfirmOk");
const confirmCancelBtn = document.getElementById("adminConfirmCancel");
 
// This variable temporarily stores WHAT should happen if admin clicks "Delete"
let pendingDeleteAction = null;
 
function askConfirm(message, onConfirmFunction) {
    confirmText.textContent = message; //Delete this donor?
    pendingDeleteAction = onConfirmFunction; // save the action for later
    confirmOverlay.classList.add("show");    // show the popup
}
 
// If admin clicks "Cancel" -> do nothing, just close popup
confirmCancelBtn.addEventListener("click", function () {
    confirmOverlay.classList.remove("show");
    pendingDeleteAction = null;
});
 
// If admin clicks "Delete" (confirm) -> run the saved action
confirmOkBtn.addEventListener("click", function () {
    if (typeof pendingDeleteAction === "function") {
        pendingDeleteAction();
    }
    confirmOverlay.classList.remove("show");
    pendingDeleteAction = null;
});
 
 
/* =========================================================
   STEP 6: HELPER FUNCTIONS TO READ/WRITE localStorage
   Think of these as simple "get data" and "save data" shortcuts
   ========================================================= */
 
// ---------- DONORS ----------
function getDonors() {
    // localStorage always stores TEXT, so we convert it back to
    // a real JavaScript array using JSON.parse().
    // If nothing is saved yet, return an empty array [].
    const data = localStorage.getItem("donors");
    return data ? JSON.parse(data) : [];
}
 
function saveDonors(donorsList) {
    // JSON.stringify() converts the array into TEXT so it can be
    // stored in localStorage (localStorage only accepts strings).
    localStorage.setItem("donors", JSON.stringify(donorsList));
}
 
// ---------- CONTACT MESSAGES ----------
function getMessages() {
    const data = localStorage.getItem("contacts");
    return data ? JSON.parse(data) : [];
}
 
function saveMessages(messagesList) {
    localStorage.setItem("contacts", JSON.stringify(messagesList));
}
 
// ---------- EMERGENCY REQUESTS ----------
// This one is a little special: it supports TWO formats so that old
// saved data (pipe "|" separated text) still works along with new
// JSON array format.
function getEmergencyRequests() {
    const rawData = localStorage.getItem("emergencyRequests");
 
    if (!rawData) {
        return []; // nothing saved yet
    }
 
    // First, try reading it as normal JSON array (new format)
    try {
        const parsedData = JSON.parse(rawData);
        if (Array.isArray(parsedData)) {
            return parsedData;
        }
    } catch (err) {
        // If JSON.parse fails, it means old pipe-separated format was used
    }
 
    // Old format fallback: each line looks like
    // "name|hospital|blood|units|contact|city|message"
    const lines = rawData.split("\n").filter(Boolean);
 
    return lines.map(function (line) {
        const parts = line.split("|");
        return {
            patientName: parts[0] || "",
            hospitalName: parts[1] || "",
            bloodGroup: parts[2] || "",
            units: parts[3] || "",
            contact: parts[4] || "",
            city: parts[5] || "",
            message: parts[6] || ""
        };
    });
}
 
function saveEmergencyRequests(list) {
    localStorage.setItem("emergencyRequests", JSON.stringify(list));
}
 
// Prevents XSS attacks — converts special characters like <script>
// into harmless text before inserting into HTML.
function escapeHtml(text) {
    const tempDiv = document.createElement("div");
    tempDiv.textContent = (text === null || text === undefined) ? "" : text;
    return tempDiv.innerHTML;
}
 
 
/* =========================================================
   STEP 6B: CHART.JS CHARTS (Blood Group Distribution + Availability)
   ---------------------------------------------------------
   We keep the chart objects in variables so that every time
   renderCharts() runs again (after a donor is added/deleted/
   toggled), we UPDATE the existing chart instead of creating
   a brand new one on top of it (that would cause overlapping
   canvases and memory leaks).
   ========================================================= */
 
let bloodGroupChartInstance = null;
let availabilityChartInstance = null;
 
// A fixed, pleasant color for each blood group so colors stay
// consistent every time the chart redraws
const BLOOD_GROUP_COLORS = {
    "A+":  "#e63946",
    "A-":  "#f4978e",
    "B+":  "#d32f2f",
    "B-":  "#f28b82",
    "AB+": "#b3122a",
    "AB-": "#ff8fa3",
    "O+":  "#8b0000",
    "O-":  "#ffb3b3"
};
 
function renderCharts() {
    const donors = getDonors();//data
 
    /* ---------- Chart 1: Blood Group Distribution ---------- */
 
    const bloodGroupCanvas = document.getElementById("bloodGroupChart");
    const bloodGroupEmpty = document.getElementById("bloodGroupChartEmpty");
 
    // Count how many donors are in each blood group
    const bloodGroupCounts = {};//blood group store panna
    donors.forEach(function (donor) { //check the each donors
        if (!donor.bloodGroup) return;
        bloodGroupCounts[donor.bloodGroup] = (bloodGroupCounts[donor.bloodGroup] || 0) + 1;
    });
 
    const bloodGroupLabels = Object.keys(bloodGroupCounts);//["O+","A+"]
    const bloodGroupData = bloodGroupLabels.map(g => bloodGroupCounts[g]);//[2,1] 
    const bloodGroupColors = bloodGroupLabels.map(g => BLOOD_GROUP_COLORS[g] || "#999999");
 
    if (bloodGroupLabels.length === 0) {

        bloodGroupCanvas.style.display = "none";//not donars will show message
        bloodGroupEmpty.style.display = "block";
    } else {
        bloodGroupCanvas.style.display = "block";//show chart
        bloodGroupEmpty.style.display = "none";
 
        if (bloodGroupChartInstance) {
            // Chart already exists -> just update its data (smooth, no flicker)
            bloodGroupChartInstance.data.labels = bloodGroupLabels;
            bloodGroupChartInstance.data.datasets[0].data = bloodGroupData;
            bloodGroupChartInstance.data.datasets[0].backgroundColor = bloodGroupColors;
            bloodGroupChartInstance.update();
        } else {
            // First time -> create a brand new donut chart
            bloodGroupChartInstance = new Chart(bloodGroupCanvas, {
                type: "doughnut",
                data: {
                    labels: bloodGroupLabels,
                    datasets: [{
                        data: bloodGroupData,
                        backgroundColor: bloodGroupColors,
                        borderWidth: 2,
                        borderColor: "#ffffff"
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: "bottom",
                            labels: { boxWidth: 12, font: { size: 12 } }
                        }
                    }
                }
            });
        }
    }
 
    /* ---------- Chart 2: Donor Availability ---------- */
 
    const availabilityCanvas = document.getElementById("availabilityChart");
    const availabilityEmpty = document.getElementById("availabilityChartEmpty");
 
    let availableCount = 0;
    let unavailableCount = 0;
 
    donors.forEach(function (donor) {
        const isAvailable = donor.available !== false;
        if (isAvailable) {
            availableCount++;
        } else {
            unavailableCount++;
        }
    });
 
    if (donors.length === 0) {
        availabilityCanvas.style.display = "none";//update pannum
        availabilityEmpty.style.display = "block";
    } else {
        availabilityCanvas.style.display = "block";//new chart create pannum
        availabilityEmpty.style.display = "none";
 
        const availabilityData = [availableCount, unavailableCount];
 
        if (availabilityChartInstance) {
            availabilityChartInstance.data.datasets[0].data = availabilityData;
            availabilityChartInstance.update();
        } else {
            availabilityChartInstance = new Chart(availabilityCanvas, {
                type: "doughnut",
                data: {
                    labels: ["Available", "Not Available"],
                    datasets: [{
                        data: availabilityData,
                        backgroundColor: ["#1c9e5a", "#e08a00"],
                        borderWidth: 2,
                        borderColor: "#ffffff"
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: "bottom",
                            labels: { boxWidth: 12, font: { size: 12 } }
                        }
                    }
                }
            });
        }
    }
}
 
 
/* =========================================================
   STEP 7: OVERVIEW TAB (dashboard summary cards + recent donors)
   ========================================================= */
 
    function renderOverview() {
    const donors = getDonors();
    const emergencyList = getEmergencyRequests();
    const messagesList = getMessages();
 
    // Fill in the 4 number cards at the top
    document.getElementById("statDonors").textContent = donors.length;
    document.getElementById("statEmergency").textContent = emergencyList.length; //upadate the number card
    document.getElementById("statMessages").textContent = messagesList.length;
 
    // Count how many DIFFERENT blood groups we have (using a Set,
    // which automatically removes duplicate values)
    const uniqueBloodGroups = new Set();//
    donors.forEach(function (donor) {
        if (donor.bloodGroup) {
            uniqueBloodGroups.add(donor.bloodGroup);
        }
    });
    document.getElementById("statBloodGroups").textContent = uniqueBloodGroups.size;
 
    // Show the last 5 donors who registered (most recent first)
    const recentTableBody = document.querySelector("#recentDonorsTable tbody");
    const recentEmptyMsg = document.getElementById("recentDonorsEmpty");
    recentTableBody.innerHTML = ""; // clear old rows first
 
    const last5Donors = donors.slice(-5).reverse();
 
    if (last5Donors.length === 0) {
        recentEmptyMsg.style.display = "block";
    } else {
        recentEmptyMsg.style.display = "none";
 
        last5Donors.forEach(function (donor) {
            const row = document.createElement("tr");
            row.innerHTML =
                "<td>" + escapeHtml(donor.fullName) + "</td>" +
                "<td><span class='badge'>" + escapeHtml(donor.bloodGroup) + "</span></td>" +
                "<td>" + escapeHtml(donor.city) + "</td>" +
                "<td>" + escapeHtml(donor.mobile) + "</td>";
            recentTableBody.appendChild(row);
        });
    }
 
    // Keep charts in sync with the latest donor data
    renderCharts();
}
 
 
/* =========================================================
   STEP 8: DONORS TAB (full list + search + filter + actions)
   ========================================================= */
 
function renderDonors() {
 
    // Read current values of search box and filter dropdowns
    const searchTerm = document.getElementById("donorSearch").value.trim().toLowerCase();
    const bloodFilter = document.getElementById("donorFilterBlood").value;
    const statusFilter = document.getElementById("donorFilterStatus").value;
 
    const allDonors = getDonors();
    const tableBody = document.querySelector("#donorsTable tbody");
    const emptyMsg = document.getElementById("donorsEmpty");
    tableBody.innerHTML = ""; // clear old rows
 
    // We will build a new filtered list based on search + filters
    const filteredDonors = [];
 
    for (let i = 0; i < allDonors.length; i++) {
        const donor = allDonors[i];
 
        // Save the donor's ORIGINAL position in the array.
        // We need this so Delete/Toggle buttons know exactly
        // which donor to update, even after filtering.
        donor._index = i;
 
        // available field might be missing on very old records,
        // so treat "not false" as available (default = true)
        const isAvailable = donor.available !== false;
 
        // Check 1: does donor match the search text?
        const nameMatch = (donor.fullName || "").toLowerCase().includes(searchTerm);
        const cityMatch = (donor.city || "").toLowerCase().includes(searchTerm);
        const mobileMatch = (donor.mobile || "").toLowerCase().includes(searchTerm);
        const matchesSearch = (searchTerm === "") || nameMatch || cityMatch || mobileMatch;
 
        // Check 2: does donor match the selected blood group filter?
        const matchesBlood = (bloodFilter === "") || (donor.bloodGroup === bloodFilter);
 
        // Check 3: does donor match the selected status filter?
        let matchesStatus = true;
        if (statusFilter === "available") {
            matchesStatus = isAvailable;
        } else if (statusFilter === "unavailable") {
            matchesStatus = !isAvailable;
        }
 
        // Only keep the donor if ALL 3 checks pass
        if (matchesSearch && matchesBlood && matchesStatus) {
            filteredDonors.push(donor);
        }
    }
 
    // If nothing matched, show the empty message and stop here
    if (filteredDonors.length === 0) {
        emptyMsg.style.display = "block";
        return;
    }
 
    emptyMsg.style.display = "none";
 
    // Now build one table row for every donor that passed the filters
    filteredDonors.forEach(function (donor) {
 
        const isAvailable = donor.available !== false;
 
        // Choose which colored badge to show
        let statusBadgeHtml;
        if (isAvailable) {
            statusBadgeHtml = "<span class='status-badge available'>Available</span>";
        } else {
            statusBadgeHtml = "<span class='status-badge unavailable'>Not Available</span>";
        }
 
        // Choose which toggle button text/style to show
        let toggleButtonHtml;
        if (isAvailable) {
            toggleButtonHtml =
                "<button class='toggle-btn make-unavailable' data-index='" + donor._index + "'>Mark Unavailable</button>";
        } else {
            toggleButtonHtml =
                "<button class='toggle-btn make-available' data-index='" + donor._index + "'>Mark Available</button>";
        }
 
        const row = document.createElement("tr");
        row.innerHTML =
            "<td>" + escapeHtml(donor.fullName) + "</td>" +
            "<td>" + escapeHtml(donor.age) + "</td>" +
            "<td>" + escapeHtml(donor.gender) + "</td>" +
            "<td><span class='badge'>" + escapeHtml(donor.bloodGroup) + "</span></td>" +
            "<td>" + escapeHtml(donor.mobile) + "</td>" +
            "<td>" + escapeHtml(donor.email) + "</td>" +
            "<td>" + escapeHtml(donor.city) + "</td>" +
            "<td>" + escapeHtml(donor.weight) + "</td>" +
            "<td>" + escapeHtml(donor.donationDate) + "</td>" +
            "<td>" + statusBadgeHtml + "</td>" +
            "<td><div class='action-btns'>" +
                toggleButtonHtml +
                "<button class='delete-btn' data-index='" + donor._index + "'>Delete</button>" +
            "</div></td>";
 
        tableBody.appendChild(row);
    });
 
    // ---- Wire up click events for the "Mark Available/Unavailable" buttons ----
    const allToggleButtons = tableBody.querySelectorAll(".toggle-btn");
    allToggleButtons.forEach(function (button) {
        button.addEventListener("click", function () {
 
            // Which donor row was this button clicked on?
            const donorIndex = Number(button.getAttribute("data-index"));
 
            // Get the FULL fresh list from storage (not the filtered one)
            const freshDonorList = getDonors();
            const donorToUpdate = freshDonorList[donorIndex];
 
            if (!donorToUpdate) {
                return; // safety check, donor not found
            }
 
            // Flip true <-> false
            const wasAvailable = donorToUpdate.available !== false;
            donorToUpdate.available = !wasAvailable;
 
            // Save the updated list back to localStorage
            saveDonors(freshDonorList);
 
            // Show a friendly message
            if (donorToUpdate.available) {
                showToast(donorToUpdate.fullName + " marked as Available", "success");
            } else {
                showToast(donorToUpdate.fullName + " marked as Not Available", "success");
            }
 
            // Refresh the table and the overview numbers
            renderDonors();
            renderOverview();
        });
    });
 
    // ---- Wire up click events for the "Delete" buttons ----
    const allDeleteButtons = tableBody.querySelectorAll(".delete-btn");
    allDeleteButtons.forEach(function (button) {
        button.addEventListener("click", function () {
 
            const donorIndex = Number(button.getAttribute("data-index"));
 
            // Ask for confirmation before deleting (custom popup, not confirm())
            askConfirm("Delete this donor record?", function () {
                const freshDonorList = getDonors();
                freshDonorList.splice(donorIndex, 1); // remove 1 item at donorIndex
                saveDonors(freshDonorList);
 
                showToast("Donor record deleted", "success");
 
                renderDonors();
                renderOverview();
            });
        });
    });
}
 
// Re-run renderDonors() whenever admin types in search box
// or changes the blood group / status filter dropdowns
document.getElementById("donorSearch").addEventListener("input", renderDonors);
document.getElementById("donorFilterBlood").addEventListener("change", renderDonors);
document.getElementById("donorFilterStatus").addEventListener("change", renderDonors);
 
 
/* =========================================================
   STEP 9: EMERGENCY REQUESTS TAB
   ========================================================= */
 
function renderEmergency() {
    const searchTerm = document.getElementById("emergencySearch").value.trim().toLowerCase();
 
    const allRequests = getEmergencyRequests();
    const tableBody = document.querySelector("#emergencyTable tbody");
    const emptyMsg = document.getElementById("emergencyEmpty");
    tableBody.innerHTML = "";
 
    const filteredRequests = [];
 
    for (let i = 0; i < allRequests.length; i++) {
        const request = allRequests[i];
        request._index = i; // remember original position for delete button
 
        const patientMatch = (request.patientName || "").toLowerCase().includes(searchTerm);
        const hospitalMatch = (request.hospitalName || "").toLowerCase().includes(searchTerm);
        const cityMatch = (request.city || "").toLowerCase().includes(searchTerm);
 
        const matchesSearch = (searchTerm === "") || patientMatch || hospitalMatch || cityMatch;
 
        if (matchesSearch) {
            filteredRequests.push(request);
        }
    }
 
    if (filteredRequests.length === 0) {
        emptyMsg.style.display = "block";
        return;
    }
 
    emptyMsg.style.display = "none";
 
    filteredRequests.forEach(function (request) {
        const row = document.createElement("tr");
        row.innerHTML =
            "<td>" + escapeHtml(request.patientName) + "</td>" +
            "<td>" + escapeHtml(request.hospitalName) + "</td>" +
            "<td><span class='badge'>" + escapeHtml(request.bloodGroup) + "</span></td>" +
            "<td>" + escapeHtml(request.units) + "</td>" +
            "<td>" + escapeHtml(request.contact) + "</td>" +
            "<td>" + escapeHtml(request.city) + "</td>" +
            "<td>" + escapeHtml(request.message) + "</td>" +
            "<td><button class='delete-btn' data-index='" + request._index + "'>Delete</button></td>";
        tableBody.appendChild(row);
    });
 
    // Wire up delete buttons for emergency requests
    const deleteButtons = tableBody.querySelectorAll(".delete-btn");
    deleteButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const requestIndex = Number(button.getAttribute("data-index"));
 
            askConfirm("Delete this emergency request?", function () {
                const freshList = getEmergencyRequests();
                freshList.splice(requestIndex, 1);
                saveEmergencyRequests(freshList);
 
                showToast("Emergency request deleted", "success");
 
                renderEmergency();
                renderOverview();
            });
        });
    });
}
 
document.getElementById("emergencySearch").addEventListener("input", renderEmergency);
 
 
/* =========================================================
   STEP 10: CONTACT MESSAGES TAB
   ========================================================= */
 
function renderMessages() {
    const searchTerm = document.getElementById("messageSearch").value.trim().toLowerCase();
 
    const allMessages = getMessages();
    const tableBody = document.querySelector("#messagesTable tbody");
    const emptyMsg = document.getElementById("messagesEmpty");
    tableBody.innerHTML = "";
 
    const filteredMessages = [];
 
    for (let i = 0; i < allMessages.length; i++) {
        const message = allMessages[i];
        message._index = i;
 
        const nameMatch = (message.name || "").toLowerCase().includes(searchTerm);
        const emailMatch = (message.email || "").toLowerCase().includes(searchTerm);
        const subjectMatch = (message.subject || "").toLowerCase().includes(searchTerm);
 
        const matchesSearch = (searchTerm === "") || nameMatch || emailMatch || subjectMatch;
 
        if (matchesSearch) {
            filteredMessages.push(message);
        }
    }
 
    if (filteredMessages.length === 0) {
        emptyMsg.style.display = "block";
        return;
    }
 
    emptyMsg.style.display = "none";
 
    filteredMessages.forEach(function (message) {
        const row = document.createElement("tr");
        row.innerHTML =
            "<td>" + escapeHtml(message.name) + "</td>" +
            "<td>" + escapeHtml(message.email) + "</td>" +
            "<td>" + escapeHtml(message.subject) + "</td>" +
            "<td>" + escapeHtml(message.message) + "</td>" +
            "<td><button class='delete-btn' data-index='" + message._index + "'>Delete</button></td>";
        tableBody.appendChild(row);
    });
 
    // Wire up delete buttons for messages
    const deleteButtons = tableBody.querySelectorAll(".delete-btn");
    deleteButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const messageIndex = Number(button.getAttribute("data-index"));
 
            askConfirm("Delete this message?", function () {
                const freshList = getMessages();
                freshList.splice(messageIndex, 1);
                saveMessages(freshList);
 
                showToast("Message deleted", "success");
 
                renderMessages();
                renderOverview();
            });
        });
    });
}
 
document.getElementById("messageSearch").addEventListener("input", renderMessages);
 
 
/* =========================================================
   STEP 11: LOAD EVERYTHING WHEN DASHBOARD OPENS
   ========================================================= */
 
function refreshAllData() {
    renderOverview();
    renderDonors();
    renderEmergency();
    renderMessages();
}