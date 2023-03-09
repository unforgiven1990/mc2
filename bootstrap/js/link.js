var link = {
    "Employee_Process": {
        "Has Subprocess": "Employee_Process",
        "Involved Stakeholders": "Role",
        "Process Category": "Capability",
        "Uses System": "System"
    },
    "Role": {
        "Has Process": "Employee_Process",
        "Has Employee": "Employee"
    },
    "Employee": {
        "Has Role": "Role",
        "Belongs to Department": "Department",
        "Works in City": "City"
    },
    "Department": {
        "Has Employee": "Employee",
        "Belongs to Department": "Department"
    },
    "Capability": {
        "Implemented by Process": "Employee_Process",
        "Defined by Department": "Department",
        "Implements Strategy": "Strategy",
        "Belongs to Topic": "Topic"
    },
    "Strategy": {
        "Implemented by Capabilities": "Capability"
    },
    "Country": {
        "Has Business Model": "Business_Model",
        "Has City": "City",
        "Has Car Models": "Car"
    },
    "Business_Model": {
        "Availble in Countries": "Country",
        "Has User Journey Parts": "User_Journey"
    },
    "Department_Category": {
        "Has Departments": "Department"
    },
    "User_Journey": {
        "Is Part of Business Model": "Business_Model",
        "Matches with Employee Journey": "Process_Category",
        "Has User Processes": "User_Process"
    },
    "Process_Category": {
        "For Business Model": "Business_Model",
        "For User Journey": "User_Journey"
    },
    "User_Process": {
        "Belongs to User Journey Part": "User_Journey"
    },
    "City": {
        "Has Employees": "Employee",
        "Is Part of": "Country",
        "Has Facility": "Facility"
    },
    "System": {
        "Used By Process": "Employee_Process"
    },
    "Car": {
        "Available in Country": "Country"
    },
    "Facility": {
        "Belongs to City": "City"
    },
    "Topic": {
        "For Capability": "Capability"
    }
}