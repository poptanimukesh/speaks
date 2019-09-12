var qIDs = ["q17", "q18",
    "q14", "q9", "q27", "q8", "q31", "q32", "q33", "q37",
    "q36", "q7", "q22", "q21", "q20", "q16",
    "q12p1", "q12p2", "q12p3", "q12p4", "q12p5", "q12p6",
    "q12p7", "q12p8", "q18po", "q23po", "q25po", "q28po"
];

var rqIDs = ["q18", "q19", "q23", "q25", "q28", "q34", "q35"];
var radioTextInputs = {
    "q18": ["3"],
    "q19": [],
    "q23": ["9", "11"],
    "q25": ["5"],
    "q28": ["11"],
    "q34": [],
    "q35": []
};

var radioTextMap = {
    "q18": [
      "IPPE",
      "Intern experience (current or past)",
      "USC faculty/staff",
      "Other"
    ],
    "q19": [
      "Yes",
      "No",
      "Unsure"
    ],
    "q23": [
      "Chain community pharmacy",
      "Independent community pharmacy",
      "Inpatient hospital",
      "Ambulatory care",
      "Pharmaceutical industry",
      "Clinical faculty",
      "Pharmaceutical sciences faculty",
      "Regulatory sciences faculty",
      "Health economics faculty",
      "Non-pharmacist Health care provider, please specify",
      "Public Health",
      "Other"
    ],
    "q25": [
      "Bachelor's",
      "PharmD",
      "PhD",
      "MD",
      "MPH",
      "Other"
    ],
    "q28": [
      "Randomized controlled trial",
      "Retrospective or prospective cohort study",
      "Case control study",
      "Case report/Case series",
      "Literature review",
      "Cross-sectional study",
      "Survival analysis",
      "Survey with primary data collection",
      "Secondary analysis of survey data",
      "Retrospective analysis of claims/patient EHR data",
      "Regression-based observational study",
      "Other"
    ],
    "q34": [
      "Yes",
      "No"
    ],
    "q35": [
      "Exempt",
      "Expedited",
      "Full board review"
    ]
};

var map = {
    "q14": "title"
};

$(document).ready(function (e) {
    $("#btn-save").click(onSave);
    $("#btn-cancel").click(onCancel);
});

var onSave = function (e) {
    var values = getValues();
    var data = values;
    data["_csrf"] = $("#_csrf").val();
    var proxyId = $("#proxyId").text();

    $.ajax({
        method: "PUT",
        url: "/api/v1/project/" + proxyId + "/details",
        data: data,
    }).done(function (result) {
        alert('Success');
    }).fail(function (err) {
        document.write(err.responseText);
    });
};

var getValues = function () {
    values = {};
    for (var i in qIDs) {
        var qID = qIDs[i];
        var elem = $(id(qID)).get(0);
        if (elem) {
            var value = $(elem).val();
            values[map[qID] || qID] = value;
        }
    }

    for (var i in rqIDs) {
        var rqID = rqIDs[i];
        var elem = $(id("radio-" + rqID + ":checked")).get(0);
        if (elem) {
            var value = $(elem).val();
            values[map[rqID] || rqID] = value;
            console.log(rqID, radioTextMap[rqID][value]);
            values[rqID + "text"] = radioTextMap[rqID][value];
            if (radioTextInputs[rqID] && radioTextInputs[rqID].indexOf(value) == -1) {
                values[rqID + "po"] = "";
                $(id(rqID + "po")).val("");
            } else {
                values[rqID + "text"] = values[rqID + "po"];
            }
        }
    }

    return values;
}

var onCancel = function (e) {
    console.log('cancel clicked');
}

var id = function (key) {
    return "#" + key;
}

var success = function (result) {
    console.log(result);
}
