var link = {
    "User_Journey": {
        "Has User Processes": "User_Process",
        "Matches with Employee Journey": "Process_Category",
        "Is Part of Business Model": "Business_Model"
    },
    "User_Process": {
        "Belongs to User Journey Part": "User_Journey",
        "Matches Employee Process": "Employee_Process"
    },
    "Process_Category": {
        "For User Journey": "User_Journey",
        "Has Employee Processes": "Employee_Process",
        "For Business Model": "Business_Model"
    },
    "Employee_Process": {
        "For User Process": "User_Process",
        "Has Subprocess": "Employee_Process",
        "For Capabilities": "Capability",
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
        "Implements Strategy": "Strategy"
    },
    "Department": {
        "Belongs to Department": "Department",
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
    }
}