var link = {
    "User_Journey": {
        "Has User Processes": "User_Process",
        "Matches with Employee Journey": "Employee_Journey",
        "Is Part of Business Model": "Business_Model"
    },
    "User_Process": {
        "Belongs to User Journey Part": "User_Journey",
        "Matches Employee Process": "Employee_Process"
    },
    "Employee_Journey": {
        "For User Journey": "User_Journey",
        "Has Employee Processes": "Employee_Process",
        "For Business Model": "Business_Model"
    },
    "Employee_Process": {
        "Matches User Process": "User_Process",
        "Implements Capabilities": "Capability",
        "Owned by Role": "Role",
        "Uses System": "System",
        "Measured by KPI": "KPI",
        "Enabled by KnowHow": "KnowHow"
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
        "Has Sub Department": "Department",
        "Belongs to Department_Class": "Department_Class",
        "Has Employee": "Employee"
    },
    "Department_Class": {
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
        "Has Employees": "Employee"
    },
    "System": {
        "Used By Process": "Employee_Process"
    },
    "KPI": {
        "Measures Process": "Employee_Process"
    },
    "Car": {
        "Available in Country": "Country"
    }
}