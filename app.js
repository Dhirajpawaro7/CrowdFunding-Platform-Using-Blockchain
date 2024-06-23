// Function to create a new campaign card
function createCampaignCard(campaign) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <h3>Campaign ID: ${campaign.id}</h3>
      <p>Creator: ${campaign.creator}</p>
      <p>Goal: ${campaign.goal} ETH</p>
      <p>Raised: ${campaign.raised} ETH</p>
      <p>Deadline: ${new Date(campaign.deadline).toLocaleString()}</p>
      <button onclick="contribute(${campaign.id})">Contribute</button>
    `;
    return card;
  }
  
  // Function to fetch and display active campaigns
  async function displayCampaigns() {
    const campaignList = document.getElementById('campaign-list');
    campaignList.innerHTML = '';
  
    // Fetch active campaigns from the server (assuming it's available at /campaigns endpoint)
    const response = await fetch('/campaigns');
    const campaigns = await response.json();
  
    // Create and append campaign cards to the campaign list
    campaigns.forEach(campaign => {
      const card = createCampaignCard(campaign);
      campaignList.appendChild(card);
    });
  }
  
  // Function to handle campaign creation form submission
  document.getElementById('create-campaign-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const goal = document.getElementById('goal').value;
    const deadline = new Date(document.getElementById('deadline').value).getTime() / 1000; // Convert to Unix timestamp
  
    // Send campaign creation request to the server
    const response = await fetch('/create-campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ goal, deadline })
    });
  
    if (response.ok) {
      // Campaign created successfully, update the campaign list
      displayCampaigns();
    } else {
      // Display an error message if campaign creation fails
      alert('Failed to create campaign. Please try again.');
    }
  });
  
  // Function to handle contribution to a campaign
  async function contribute(campaignId) {
    // Send contribution request to the server
    const response = await fetch(`/contribute/${campaignId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (response.ok) {
      // Contribution successful, update the campaign list
      displayCampaigns();
    } else {
      // Display an error message if contribution fails
      alert('Failed to contribute to the campaign. Please try again.');
    }
  }
  
  // Display active campaigns when the page loads
  displayCampaigns();
  