/* =========================================================
   MEDICARE EMR
   COMPLETE SCRIPT.JS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       1. MASTER MENU
    ===================================================== */

    const masterButton =
        document.getElementById("masterMenuButton");

    const masterSubmenu =
        document.getElementById("masterSubmenu");


    if (masterButton && masterSubmenu) {

        masterButton.addEventListener("click", function (event) {

            event.preventDefault();

            masterSubmenu.classList.toggle("show");

            masterButton.classList.toggle("open");

        });

    }



    /* =====================================================
       2. ADDRESS MENU
    ===================================================== */

    const addressButton =
        document.getElementById("addressMenuButton");

    const addressSubmenu =
        document.getElementById("addressSubmenu");


    if (addressButton && addressSubmenu) {

        addressButton.addEventListener("click", function (event) {

            event.preventDefault();

            addressSubmenu.classList.toggle("show");

            addressButton.classList.toggle("open");

        });

    }



    /* =====================================================
       3. KEEP MASTER OPEN ON MASTER PAGES
    ===================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    if (
        currentPage.startsWith("master-") &&
        masterButton &&
        masterSubmenu
    ) {

        masterSubmenu.classList.add("show");

        masterButton.classList.add("open");

    }



    /* =====================================================
       4. KEEP ADDRESS OPEN ON ADDRESS MASTER PAGES
    ===================================================== */

    const addressPages = [

        "master-country.html",
        "master-province.html",
        "master-district.html",
        "master-municipal.html",
        "master-occupation.html",
        "master-religion.html",
        "master-ethnic-group.html",
        "master-identity-proof-type.html",
        "master-disability.html"

    ];


    if (
        addressPages.includes(currentPage) &&
        addressButton &&
        addressSubmenu
    ) {

        addressSubmenu.classList.add("show");

        addressButton.classList.add("open");

    }



    /* =====================================================
       5. HIGHLIGHT CURRENT SIDEBAR PAGE
    ===================================================== */

    const sidebarLinks =
        document.querySelectorAll(
            ".sidebar nav a"
        );


    sidebarLinks.forEach(function (link) {

        const href =
            link.getAttribute("href");


        if (!href) {
            return;
        }


        if (
            href.toLowerCase() ===
            currentPage
        ) {

            link.classList.add("active");

        }

    });



    /* =====================================================
       6. LOCAL STORAGE HELPERS
    ===================================================== */

    function getRegistrations() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "emrRegistrations"
                )
            ) || [];

        }

        catch (error) {

            console.error(
                "Could not load registrations:",
                error
            );

            return [];

        }

    }



    function saveRegistrations(records) {

        localStorage.setItem(
            "emrRegistrations",
            JSON.stringify(records)
        );

    }



    /* =====================================================
       7. GET ELEMENT VALUE
    ===================================================== */

    function getValue(id) {

        const element =
            document.getElementById(id);


        if (!element) {
            return "";
        }


        return String(
            element.value || ""
        ).trim();

    }



    /* =====================================================
       8. GET NUMBER
    ===================================================== */

    function getNumber(id) {

        const number =
            Number(
                getValue(id)
            );


        if (Number.isNaN(number)) {

            return 0;

        }


        return number;

    }



    /* =====================================================
       9. SAFE TEXT
    ===================================================== */

    function safeText(value) {

        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {

            return "-";

        }


        return String(value);

    }



    /* =====================================================
       10. DATE STRING
    ===================================================== */

    function createDateString(date) {

        const year =
            date.getFullYear();


        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                date.getDate()
            ).padStart(2, "0");


        return (
            year +
            "-" +
            month +
            "-" +
            day
        );

    }



    /* =====================================================
       11. TIME STRING
    ===================================================== */

    function createTimeString(date) {

        return date.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }



    /* =====================================================
       12. REGISTRATION FORM
    ===================================================== */

    const patientForm =
        document.getElementById(
            "patientForm"
        );


    if (patientForm) {


        /* =================================================
           REGISTRATION DATE
        ================================================= */

        const registrationDate =
            document.getElementById(
                "registrationDate"
            );


        if (
            registrationDate &&
            !registrationDate.value
        ) {

            registrationDate.value =
                createDateString(
                    new Date()
                );

        }



        /* =================================================
           REGISTRATION NUMBER
        ================================================= */

        const registrationNumber =
            document.getElementById(
                "registrationNumber"
            );


        let nextRegistrationNumber =
            Number(
                localStorage.getItem(
                    "emrNextRegistrationNumber"
                )
            );


        if (!nextRegistrationNumber) {

            nextRegistrationNumber =
                1001;

        }


        function showRegistrationNumber() {

            if (registrationNumber) {

                registrationNumber.textContent =
                    "REG-" +
                    nextRegistrationNumber;

            }

        }


        showRegistrationNumber();



        /* =================================================
           MRN NUMBER
        ================================================= */

        let nextMRN =
            Number(
                localStorage.getItem(
                    "emrNextMRN"
                )
            );


        if (!nextMRN) {

            nextMRN =
                1001;

        }



        /* =================================================
           DATE OF BIRTH -> AGE
        ================================================= */

        const dob =
            document.getElementById(
                "dob"
            );


        const ageYears =
            document.getElementById(
                "ageYears"
            );


        const ageMonths =
            document.getElementById(
                "ageMonths"
            );


        const ageDays =
            document.getElementById(
                "ageDays"
            );


        function calculateAge() {

            if (
                !dob ||
                !dob.value
            ) {

                return;

            }


            const birthDate =
                new Date(
                    dob.value +
                    "T00:00:00"
                );


            const today =
                new Date();


            if (
                Number.isNaN(
                    birthDate.getTime()
                )
            ) {

                return;

            }


            if (birthDate > today) {

                if (ageYears) {
                    ageYears.value = "";
                }

                if (ageMonths) {
                    ageMonths.value = "";
                }

                if (ageDays) {
                    ageDays.value = "";
                }

                return;

            }


            let years =
                today.getFullYear() -
                birthDate.getFullYear();


            let months =
                today.getMonth() -
                birthDate.getMonth();


            let days =
                today.getDate() -
                birthDate.getDate();


            if (days < 0) {

                months--;


                const previousMonth =
                    new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        0
                    );


                days +=
                    previousMonth.getDate();

            }


            if (months < 0) {

                years--;

                months += 12;

            }


            if (ageYears) {

                ageYears.value =
                    Math.max(
                        years,
                        0
                    );

            }


            if (ageMonths) {

                ageMonths.value =
                    Math.max(
                        months,
                        0
                    );

            }


            if (ageDays) {

                ageDays.value =
                    Math.max(
                        days,
                        0
                    );

            }

        }


        if (dob) {

            dob.addEventListener(
                "change",
                calculateAge
            );

            dob.addEventListener(
                "input",
                calculateAge
            );

        }



        /* =================================================
           BILLING ELEMENTS
        ================================================= */

        const charge =
            document.getElementById(
                "charge"
            );


        const discount =
            document.getElementById(
                "discount"
            );


        const tax =
            document.getElementById(
                "tax"
            );


        const chargeDisplay =
            document.getElementById(
                "chargeDisplay"
            );


        const discountDisplay =
            document.getElementById(
                "discountDisplay"
            );


        const taxDisplay =
            document.getElementById(
                "taxDisplay"
            );


        const grandTotal =
            document.getElementById(
                "grandTotal"
            );


        const paymentTotal =
            document.getElementById(
                "paymentTotal"
            );


        const tenderAmount =
            document.getElementById(
                "tenderAmount"
            );


        const changeAmount =
            document.getElementById(
                "changeAmount"
            );



        /* =================================================
           CALCULATE BILLING
        ================================================= */

        function calculateBilling() {

            const chargeValue =
                getNumber("charge");


            const discountValue =
                getNumber("discount");


            const taxPercent =
                getNumber("tax");


            let subtotal =
                chargeValue -
                discountValue;


            if (subtotal < 0) {

                subtotal = 0;

            }


            const taxAmount =
                subtotal *
                taxPercent /
                100;


            const total =
                subtotal +
                taxAmount;



            if (chargeDisplay) {

                chargeDisplay.textContent =
                    "Rs. " +
                    chargeValue.toFixed(2);

            }


            if (discountDisplay) {

                discountDisplay.textContent =
                    "Rs. " +
                    discountValue.toFixed(2);

            }


            if (taxDisplay) {

                taxDisplay.textContent =
                    "Rs. " +
                    taxAmount.toFixed(2);

            }


            if (grandTotal) {

                grandTotal.textContent =
                    "Rs. " +
                    total.toFixed(2);

            }


            if (paymentTotal) {

                if (
                    paymentTotal.tagName ===
                    "INPUT"
                ) {

                    paymentTotal.value =
                        total.toFixed(2);

                }

                else {

                    paymentTotal.textContent =
                        "Rs. " +
                        total.toFixed(2);

                }

            }


            calculateChange();


            return total;

        }



        /* =================================================
           CALCULATE CHANGE
        ================================================= */

        function calculateChange() {

            if (!changeAmount) {
                return;
            }


            let total = 0;


            if (paymentTotal) {

                if (
                    paymentTotal.tagName ===
                    "INPUT"
                ) {

                    total =
                        Number(
                            paymentTotal.value
                        ) || 0;

                }

                else {

                    total =
                        Number(
                            paymentTotal.textContent
                                .replace("Rs.", "")
                                .trim()
                        ) || 0;

                }

            }


            const tender =
                getNumber(
                    "tenderAmount"
                );


            let change =
                tender -
                total;


            if (change < 0) {

                change = 0;

            }


            if (
                changeAmount.tagName ===
                "INPUT"
            ) {

                changeAmount.value =
                    change.toFixed(2);

            }

            else {

                changeAmount.textContent =
                    "Rs. " +
                    change.toFixed(2);

            }

        }



        /* =================================================
           BILLING EVENTS
        ================================================= */

        if (charge) {

            charge.addEventListener(
                "input",
                calculateBilling
            );

        }


        if (discount) {

            discount.addEventListener(
                "input",
                calculateBilling
            );

        }


        if (tax) {

            tax.addEventListener(
                "input",
                calculateBilling
            );

        }


        if (tenderAmount) {

            tenderAmount.addEventListener(
                "input",
                calculateChange
            );

        }


        calculateBilling();



        /* =================================================
           PAYMENT METHOD
        ================================================= */

        function getPaymentMethod() {

            const selected =
                document.querySelector(
                    'input[name="payment"]:checked'
                );


            if (!selected) {

                return "";

            }


            return selected.value;

        }



        /* =================================================
           CHECKBOX VALUES
        ================================================= */

        function getAccessibilityOptions() {

            const checkboxes =
                document.querySelectorAll(
                    'input[name="accessibility"]:checked'
                );


            const values = [];


            checkboxes.forEach(
                function (checkbox) {

                    values.push(
                        checkbox.value
                    );

                }
            );


            return values;

        }



        /* =================================================
           SAVE DRAFT
        ================================================= */

        const saveDraftButton =
            document.getElementById(
                "saveDraftBtn"
            );


        if (saveDraftButton) {

            saveDraftButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    const draft = {

                        firstName:
                            getValue(
                                "firstName"
                            ),

                        middleName:
                            getValue(
                                "middleName"
                            ),

                        lastName:
                            getValue(
                                "lastName"
                            ),

                        mobile:
                            getValue(
                                "mobile"
                            ),

                        country:
                            getValue(
                                "country"
                            ),

                        province:
                            getValue(
                                "province"
                            ),

                        district:
                            getValue(
                                "district"
                            ),

                        municipality:
                            getValue(
                                "municipality"
                            ),

                        department:
                            getValue(
                                "department"
                            ),

                        doctor:
                            getValue(
                                "doctor"
                            ),

                        savedAt:
                            new Date()
                                .toISOString()

                    };


                    localStorage.setItem(
                        "emrRegistrationDraft",
                        JSON.stringify(
                            draft
                        )
                    );


                    alert(
                        "Draft saved successfully."
                    );

                }
            );

        }



        /* =================================================
           SUBMIT REGISTRATION
        ================================================= */

        patientForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                if (
                    !patientForm.checkValidity()
                ) {

                    patientForm.reportValidity();

                    return;

                }


                const now =
                    new Date();


                const firstName =
                    getValue(
                        "firstName"
                    );


                const middleName =
                    getValue(
                        "middleName"
                    );


                const lastName =
                    getValue(
                        "lastName"
                    );


                const patientName =
                    [
                        firstName,
                        middleName,
                        lastName
                    ]
                    .filter(Boolean)
                    .join(" ");


                const total =
                    calculateBilling();



                const record = {


                    /* ===============================
                       REGISTRATION
                    =============================== */

                    mrn:
                        "MRN-" +
                        nextMRN,


                    registrationNumber:
                        "REG-" +
                        nextRegistrationNumber,


                    patient:
                        patientName,


                    firstName:
                        firstName,


                    middleName:
                        middleName,


                    lastName:
                        lastName,


                    registrationType:
                        getValue(
                            "registrationType"
                        ),


                    patientType:
                        getValue(
                            "patientType"
                        ),


                    visitType:
                        getValue(
                            "visitType"
                        ) ||
                        getValue(
                            "patientType"
                        ),



                    /* ===============================
                       PERSONAL INFORMATION
                    =============================== */

                    dob:
                        getValue(
                            "dob"
                        ),


                    ageYears:
                        getValue(
                            "ageYears"
                        ),


                    ageMonths:
                        getValue(
                            "ageMonths"
                        ),


                    ageDays:
                        getValue(
                            "ageDays"
                        ),


                    gender:
                        getValue(
                            "gender"
                        ),


                    mobile:
                        getValue(
                            "mobile"
                        ),


                    phone:
                        getValue(
                            "phone"
                        ),


                    email:
                        getValue(
                            "email"
                        ),


                    maritalStatus:
                        getValue(
                            "maritalStatus"
                        ),



                    /* ===============================
                       ADDRESS
                    =============================== */

                    country:
                        getValue(
                            "country"
                        ),


                    province:
                        getValue(
                            "province"
                        ),


                    district:
                        getValue(
                            "district"
                        ),


                    municipality:
                        getValue(
                            "municipality"
                        ),


                    ward:
                        getValue(
                            "ward"
                        ),


                    tole:
                        getValue(
                            "tole"
                        ),



                    /* ===============================
                       ADDITIONAL INFORMATION
                    =============================== */

                    occupation:
                        getValue(
                            "occupation"
                        ),


                    religion:
                        getValue(
                            "religion"
                        ),


                    ethnicGroup:
                        getValue(
                            "ethnicGroup"
                        ),


                    identityType:
                        getValue(
                            "identityType"
                        ),


                    identityNumber:
                        getValue(
                            "identityNumber"
                        ),


                    disability:
                        getValue(
                            "disability"
                        ),


                    oldMrno:
                        getValue(
                            "oldMrno"
                        ),


                    opdUnit:
                        getValue(
                            "opdUnit"
                        ),


                    hearAbout:
                        getValue(
                            "hearAbout"
                        ),


                    doctorConsent:
                        getValue(
                            "doctorConsent"
                        ),


                    accessibility:
                        getAccessibilityOptions(),



                    /* ===============================
                       DEPARTMENT / DOCTOR
                    =============================== */

                    department:
                        getValue(
                            "department"
                        ),


                    subDepartment:
                        getValue(
                            "subDepartment"
                        ),


                    doctor:
                        getValue(
                            "doctor"
                        ),



                    /* ===============================
                       BILLING
                    =============================== */

                    charge:
                        getNumber(
                            "charge"
                        ),


                    discount:
                        getNumber(
                            "discount"
                        ),


                    tax:
                        getNumber(
                            "tax"
                        ),


                    amount:
                        total,


                    narration:
                        getValue(
                            "narration"
                        ),



                    /* ===============================
                       PAYMENT
                    =============================== */

                    payment:
                        getPaymentMethod(),


                    tenderAmount:
                        getNumber(
                            "tenderAmount"
                        ),



                    /* ===============================
                       SYSTEM DATA
                    =============================== */

                    visitDate:

                        registrationDate &&
                        registrationDate.value

                            ? registrationDate.value

                            : createDateString(
                                now
                            ),


                    visitTime:
                        createTimeString(
                            now
                        ),


                    visitDateTime:

                        (
                            registrationDate &&
                            registrationDate.value

                                ? registrationDate.value

                                : createDateString(
                                    now
                                )
                        )

                        +

                        " "

                        +

                        createTimeString(
                            now
                        ),


                    insertUser:
                        "Admin",


                    insertTime:
                        createTimeString(
                            now
                        ),


                    createdAt:
                        now.toISOString(),


                    status:
                        "Active"

                };



                /* ===============================
                   SAVE REGISTRATION
                =============================== */

                const registrations =
                    getRegistrations();


                registrations.push(
                    record
                );


                saveRegistrations(
                    registrations
                );



                /* ===============================
                   UPDATE NEXT NUMBERS
                =============================== */

                nextMRN++;

                nextRegistrationNumber++;


                localStorage.setItem(
                    "emrNextMRN",
                    String(
                        nextMRN
                    )
                );


                localStorage.setItem(
                    "emrNextRegistrationNumber",
                    String(
                        nextRegistrationNumber
                    )
                );



                /* ===============================
                   REMOVE DRAFT
                =============================== */

                localStorage.removeItem(
                    "emrRegistrationDraft"
                );



                /* ===============================
                   SUCCESS MESSAGE
                =============================== */

                const successMessage =
                    document.getElementById(
                        "successMessage"
                    );


                const successText =
                    document.getElementById(
                        "successText"
                    );


                if (successText) {

                    successText.textContent =
                        patientName +
                        " registered successfully. MRN: " +
                        record.mrn;

                }


                if (successMessage) {

                    successMessage.style.display =
                        "block";

                }



                /* ===============================
                   RESET FORM
                =============================== */

                patientForm.reset();


                if (registrationDate) {

                    registrationDate.value =
                        createDateString(
                            new Date()
                        );

                }


                if (charge) {

                    charge.value =
                        "100";

                }


                if (discount) {

                    discount.value =
                        "0";

                }


                if (tax) {

                    tax.value =
                        "0";

                }


                showRegistrationNumber();

                calculateBilling();


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );



        /* =================================================
           CLEAR REGISTRATION
        ================================================= */

        const clearRegistrationButton =
            document.getElementById(
                "clearRegistrationBtn"
            );


        if (clearRegistrationButton) {

            clearRegistrationButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    patientForm.reset();


                    if (registrationDate) {

                        registrationDate.value =
                            createDateString(
                                new Date()
                            );

                    }


                    const successMessage =
                        document.getElementById(
                            "successMessage"
                        );


                    if (successMessage) {

                        successMessage.style.display =
                            "none";

                    }


                    calculateBilling();

                }
            );

        }

    }



    /* =====================================================
       13. DASHBOARD
    ===================================================== */

    function loadDashboard() {

        const totalPatients =
            document.getElementById(
                "totalPatients"
            );


        const todayRegistrations =
            document.getElementById(
                "todayRegistrations"
            );


        const totalAppointments =
            document.getElementById(
                "totalAppointments"
            );


        const todayBilling =
            document.getElementById(
                "todayBilling"
            );


        const recentBody =
            document.getElementById(
                "dashboardRecentRegistrations"
            );



        if (
            !totalPatients &&
            !todayRegistrations &&
            !totalAppointments &&
            !todayBilling &&
            !recentBody
        ) {

            return;

        }



        const registrations =
            getRegistrations();


        /* TOTAL PATIENTS */

        if (totalPatients) {

            totalPatients.textContent =
                registrations.length;

        }



        /* TODAY */

        const today =
            createDateString(
                new Date()
            );


        const todaysRecords =
            registrations.filter(
                function (record) {

                    return (

                        record.visitDate ===
                        today

                        ||

                        (
                            record.visitDateTime &&
                            record.visitDateTime
                                .startsWith(today)
                        )

                    );

                }
            );



        /* TODAY REGISTRATIONS */

        if (todayRegistrations) {

            todayRegistrations.textContent =
                todaysRecords.length;

        }



        /* APPOINTMENTS */

        if (totalAppointments) {

            let appointments = [];


            try {

                appointments =
                    JSON.parse(
                        localStorage.getItem(
                            "emrAppointments"
                        )
                    ) || [];

            }

            catch (error) {

                appointments = [];

            }


            totalAppointments.textContent =
                appointments.length;

        }



        /* TODAY BILLING */

        if (todayBilling) {

            const billingTotal =
                todaysRecords.reduce(
                    function (
                        total,
                        record
                    ) {

                        return (
                            total +
                            (
                                Number(
                                    record.amount
                                ) || 0
                            )
                        );

                    },
                    0
                );


            todayBilling.textContent =
                "Rs. " +
                billingTotal.toFixed(2);

        }



        /* =================================================
           RECENT REGISTRATIONS
        ================================================= */

        if (recentBody) {

            recentBody.innerHTML = "";


            if (
                registrations.length === 0
            ) {

                const emptyRow =
                    document.createElement(
                        "tr"
                    );


                const emptyCell =
                    document.createElement(
                        "td"
                    );


                emptyCell.colSpan = 6;

                emptyCell.style.textAlign =
                    "center";

                emptyCell.style.color =
                    "#89939e";

                emptyCell.style.padding =
                    "35px";


                emptyCell.innerHTML =
                    'No registrations yet.<br><br>' +
                    '<a href="registration.html">' +
                    'Register a demo patient' +
                    '</a>';


                emptyRow.appendChild(
                    emptyCell
                );


                recentBody.appendChild(
                    emptyRow
                );


                return;

            }



            const recentRecords =
                registrations
                    .slice()
                    .reverse()
                    .slice(
                        0,
                        5
                    );


            recentRecords.forEach(
                function (record) {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    const values = [

                        safeText(
                            record.mrn
                        ),

                        safeText(
                            record.patient
                        ),

                        safeText(
                            record.department
                        ),

                        safeText(
                            record.doctor
                        ),

                        safeText(
                            record.visitDateTime
                        )

                    ];


                    values.forEach(
                        function (value) {

                            const cell =
                                document.createElement(
                                    "td"
                                );


                            cell.textContent =
                                value;


                            row.appendChild(
                                cell
                            );

                        }
                    );


                    const statusCell =
                        document.createElement(
                            "td"
                        );


                    const status =
                        document.createElement(
                            "span"
                        );


                    status.className =
                        "status completed";


                    status.textContent =
                        "Registered";


                    statusCell.appendChild(
                        status
                    );


                    row.appendChild(
                        statusCell
                    );


                    recentBody.appendChild(
                        row
                    );

                }
            );

        }

    }


    loadDashboard();



    /* =====================================================
       14. REGISTRATION REPORT
    ===================================================== */

    const reportBody =
        document.getElementById(
            "registrationReportBody"
        );


    const reportSearch =
        document.getElementById(
            "registrationReportSearch"
        );


    const registrationCount =
        document.getElementById(
            "registrationCount"
        );


    const noRegistrationData =
        document.getElementById(
            "noRegistrationData"
        );



    function renderRegistrationReport(
        searchValue = ""
    ) {

        if (!reportBody) {

            return;

        }


        const registrations =
            getRegistrations();


        const search =
            String(
                searchValue || ""
            )
            .toLowerCase()
            .trim();



        const filtered =
            registrations.filter(
                function (record) {

                    const searchableText =
                        [

                            record.mrn,
                            record.patient,
                            record.registrationType,
                            record.municipality,
                            record.department,
                            record.doctor,
                            record.visitType,
                            record.visitDateTime,
                            record.insertUser,
                            record.insertTime

                        ]
                        .join(" ")
                        .toLowerCase();


                    return searchableText.includes(
                        search
                    );

                }
            );



        reportBody.innerHTML = "";


        if (registrationCount) {

            registrationCount.textContent =
                filtered.length;

        }



        if (
            filtered.length === 0
        ) {

            if (noRegistrationData) {

                noRegistrationData.style.display =
                    "block";

            }


            return;

        }



        if (noRegistrationData) {

            noRegistrationData.style.display =
                "none";

        }



        filtered.forEach(
            function (
                record,
                index
            ) {

                const row =
                    document.createElement(
                        "tr"
                    );


                const values = [

                    index + 1,

                    safeText(
                        record.mrn
                    ),

                    safeText(
                        record.patient
                    ),

                    safeText(
                        record.registrationType
                    ),

                    safeText(
                        record.municipality
                    ),

                    safeText(
                        record.department
                    ),

                    safeText(
                        record.doctor
                    ),

                    safeText(
                        record.visitType
                    ),

                    safeText(
                        record.visitDateTime
                    ),

                    safeText(
                        record.insertUser
                    ),

                    safeText(
                        record.insertTime
                    )

                ];


                values.forEach(
                    function (value) {

                        const cell =
                            document.createElement(
                                "td"
                            );


                        cell.textContent =
                            value;


                        row.appendChild(
                            cell
                        );

                    }
                );


                reportBody.appendChild(
                    row
                );

            }
        );

    }



    if (reportBody) {

        renderRegistrationReport();

    }



    if (reportSearch) {

        reportSearch.addEventListener(
            "input",
            function () {

                renderRegistrationReport(
                    reportSearch.value
                );

            }
        );

    }



    /* =====================================================
       15. PRINT REPORT
    ===================================================== */

    const printReportButton =
        document.getElementById(
            "printReportBtn"
        );


    if (printReportButton) {

        printReportButton.addEventListener(
            "click",
            function () {

                window.print();

            }
        );

    }



    /* =====================================================
       16. UPDATE DATA BETWEEN OPEN TABS
    ===================================================== */

    window.addEventListener(
        "storage",
        function (event) {

            if (
                event.key ===
                "emrRegistrations"
            ) {

                loadDashboard();


                if (reportBody) {

                    renderRegistrationReport(
                        reportSearch
                            ? reportSearch.value
                            : ""
                    );

                }

            }

        }
    );


});


/* ==========================================
   
/* ==============================================
   REGISTRATION COUNTRY AND PROVINCE CONNECTION
============================================== */

document.addEventListener("DOMContentLoaded", function () {

    const countrySelect = document.getElementById("country");
    const provinceSelect = document.getElementById("province");

    if (!countrySelect || !provinceSelect) {
        console.warn("Country or Province dropdown not found.");
        return;
    }

    function getMasterData(key) {
        try {
            const data = JSON.parse(
                localStorage.getItem(key) || "[]"
            );
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Error reading " + key, error);
            return [];
        }
    }

    function loadCountries() {
        const previous = countrySelect.value;
        const countries = getMasterData("emrCountries");

        countrySelect.innerHTML =
            '<option value="">Select Country</option>';

        countries.forEach(function (country) {
            if (country.status !== "Active") return;

            const option = document.createElement("option");
            option.value = country.name;
            option.textContent = country.name;
            countrySelect.appendChild(option);
        });

        if (Array.from(countrySelect.options).some(
            option => option.value === previous
        )) {
            countrySelect.value = previous;
        }

        loadProvinces();
    }

    function loadProvinces() {
        const previous = provinceSelect.value;
        const selectedCountry = countrySelect.value.trim().toLowerCase();

        const provinces = getMasterData("emrProvinces");

        provinceSelect.innerHTML =
            '<option value="">Select Province</option>';

        provinces.forEach(function (province) {

            if (province.status !== "Active") return;

            if (
                String(province.country).trim().toLowerCase()
                !== selectedCountry
            ) {
                return;
            }

            const option = document.createElement("option");
            option.value = province.name;
            option.textContent = province.name;
            provinceSelect.appendChild(option);
        });

        if (Array.from(provinceSelect.options).some(
            option => option.value === previous
        )) {
            provinceSelect.value = previous;
        }
    }

    countrySelect.addEventListener("change", loadProvinces);

    window.addEventListener("storage", function (event) {
        if (event.key === "emrCountries") {
            loadCountries();
        }

        if (event.key === "emrProvinces") {
            loadProvinces();
        }
    });

    loadCountries();

});

/* ==============================================
   REGISTRATION DISTRICT CONNECTION
============================================== */

document.addEventListener("DOMContentLoaded", function () {

    const country = document.getElementById("country");
    const province = document.getElementById("province");
    const district = document.getElementById("district");

    if (!country || !province || !district) return;

    function readDistricts() {
        try {
            const data = JSON.parse(
                localStorage.getItem("emrDistricts") || "[]"
            );
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    }

    function loadDistricts() {
        const selectedCountry = country.value.trim().toLowerCase();
        const selectedProvince = province.value.trim().toLowerCase();
        const previous = district.value;

        district.replaceChildren();
        district.add(new Option("Select District", ""));

        readDistricts()
            .filter(item =>
                item.status === "Active" &&
                String(item.country).trim().toLowerCase() === selectedCountry &&
                String(item.province).trim().toLowerCase() === selectedProvince
            )
            .forEach(item => {
                district.add(new Option(item.name, item.name));
            });

        if ([...district.options].some(o => o.value === previous)) {
            district.value = previous;
        }
    }

    country.addEventListener("change", loadDistricts);
    province.addEventListener("change", loadDistricts);

    window.addEventListener("storage", function (event) {
        if (event.key === "emrDistricts") loadDistricts();
    });

    loadDistricts();
});

/* 
/* ============================================
   MUNICIPAL SELECTION -> AUTO-FILL ADDRESS
============================================ */

document.addEventListener("DOMContentLoaded", function () {

    const country = document.getElementById("country");
    const province = document.getElementById("province");
    const district = document.getElementById("district");
    const municipality = document.getElementById("municipality");

    if (!country || !province || !district || !municipality) {
        console.warn("Registration address fields not found.");
        return;
    }

    function readData(key) {
        try {
            const data = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function setDropdown(select, value, placeholder) {
        select.replaceChildren();
        select.add(new Option(placeholder, ""));

        if (value) {
            select.add(new Option(value, value));
            select.value = value;
        }
    }

    function loadMunicipals() {
        const previous = municipality.value;

        municipality.replaceChildren();
        municipality.add(new Option("Select Municipal", ""));

        const municipals = readData("emrMunicipals")
            .filter(item => normalize(item.status) === "active");

        municipals.forEach(function (item) {
            const option = new Option(item.name, item.id);
            municipality.add(option);
        });

        if ([...municipality.options].some(
            option => option.value === previous
        )) {
            municipality.value = previous;
        }
    }

    function fillAddressFromMunicipal() {
        const municipalId = municipality.value;

        if (!municipalId) {
            setDropdown(country, "", "Select Country");
            setDropdown(province, "", "Select Province");
            setDropdown(district, "", "Select District");
            return;
        }

        const municipals = readData("emrMunicipals");

        const selected = municipals.find(
            item => item.id === municipalId
        );

        if (!selected) return;

        setDropdown(country, selected.country, "Select Country");
        setDropdown(province, selected.province, "Select Province");
        setDropdown(district, selected.district, "Select District");
    }

    municipality.addEventListener(
        "change",
        fillAddressFromMunicipal
    );

    window.addEventListener("storage", function (event) {
        if (event.key === "emrMunicipals") {
            loadMunicipals();
            fillAddressFromMunicipal();
        }
    });

    loadMunicipals();
    fillAddressFromMunicipal();

});
