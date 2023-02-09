var link = {
    "User_Journey": {
        "Has User Processes": "User_Process",
        "Matches with Employee Journey": "Process_Category",
        "Is Part of Business Model": "Business_Model"
    },
    "User_Process": {
        "Belongs to User Journey Part": "User_Journey"
    },
    "Process_Category": {
        "For User Journey": "User_Journey",
        "For Business Model": "Business_Model"
    },
    "Employee_Process": {
        "Has Subprocess": "Employee_Process",
        "Process Category": "Capability",
        "Operated by Role": "Role",
        "Uses System": "System"
    },
    "Country": {
        "Has Business Model": "Business_Model",
        "Has City": "City",
        "Has Car Models": "Car"
    },
    "Business_Model": {
        "Has User Journey Parts": "User_Journey",
        "Availble in Countries": "Country"
    },
    "Strategy": {
        "Implemented by Capabilities": "Capability"
    },
    "Capability": {
        "Implemented by Process": "Employee_Process",
        "Implements Strategy": "Strategy",
        "Defined by Department": "Department",
        "Belongs to Topic": "Topic"
    },
    "Department": {
        "Belongs to Department": "Department",
        "Belongs to Department_Class": "Department_Category",
        "Has Employee": "Employee"
    },
    "Department_Category": {
        "Has Departments": "Department"
    },
    "Employee": {
        "Belongs to Department": "Department",
        "Has Role": "Role",
        "Works in City": "City"
    },
    "Role": {
        "Has Process": "Employee_Process",
        "Has Employee": "Employee"
    },
    "City": {
        "Is Part of": "Country",
        "Has Employees": "Employee",
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