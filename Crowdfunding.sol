pragma solidity ^0.8.0;

contract Crowdfunding {
    struct Project {
        address payable creator;
        string title;
        uint256 goalAmount;
        uint256 totalAmount;
        uint256 deadline;
        bool isOpen;
        mapping(address => uint256) donations;
    }

    Project[] public projects;

    event ProjectCreated(address indexed creator, uint256 projectId, string title, uint256 goalAmount, uint256 deadline);
    event Donation(address indexed donor, uint256 projectId, uint256 amount);

    function createProject(string memory _title, uint256 _goalAmount, uint256 _deadline) external {
        require(_deadline > block.timestamp, "Deadline must be in the future");
        projects.push(Project({
            creator: payable(msg.sender),
            title: _title,
            goalAmount: _goalAmount,
            totalAmount: 0,
            deadline: _deadline,
            isOpen: true
        }));
        emit ProjectCreated(msg.sender, projects.length - 1, _title, _goalAmount, _deadline);
    }

    function donate(uint256 _projectId) external payable {
        require(_projectId < projects.length, "Invalid project ID");
        Project storage project = projects[_projectId];
        require(project.isOpen, "Project is closed");
        require(block.timestamp < project.deadline, "Project deadline passed");
        require(msg.value > 0, "Donation amount must be greater than zero");
        
        project.donations[msg.sender] += msg.value;
        project.totalAmount += msg.value;
        emit Donation(msg.sender, _projectId, msg.value);
    }

    function closeProject(uint256 _projectId) external {
        require(_projectId < projects.length, "Invalid project ID");
        Project storage project = projects[_projectId];
        require(project.creator == msg.sender, "Only project creator can close the project");
        require(block.timestamp >= project.deadline, "Project deadline not passed yet");
        project.isOpen = false;
    }

    function withdrawFunds(uint256 _projectId) external {
        require(_projectId < projects.length, "Invalid project ID");
        Project storage project = projects[_projectId];
        require(project.creator == msg.sender, "Only project creator can withdraw funds");
        require(!project.isOpen, "Project is still open");
        require(project.totalAmount >= project.goalAmount, "Goal amount not reached");

        payable(msg.sender).transfer(project.totalAmount);
        project.totalAmount = 0;
    }
}
