const path = require("path");
const { SuperHDWalletProvider, ManualSignProvider } = require("super-web3-provider");

// IMPORTANT: We need to globally store these providers here due to the fact that Truffle decides to call
// the provider() function multiple times during a deployment, therefore we would be re-creating
// a deployment on every call. 
let rinkebyProvider;
let rinkebyMetamaskProvider;
let mainnetProvider;

/**
 * PRO TIP: If you want to run all this inside your terminal to try things out, simply assign the variables 
 * here and good to go. We do recommend though to put all this as ENV variables when running in a CI, so
 * you never actually commit this values into your repository
 */

// Make sure to login into Superblocks, and create a new deployment space in a project. You can find 
// the deployment space id inside the space settings by clicking the gear icon next to the name
// const deploymentSpaceId = '5e2fdb1499878058a3f98872';
const deploymentSpaceId = '5e21566e3f362c0011a880ae';

// You need to create a new token in order to authenticate against the service. Login into the dashboard,
// select the project you want to deploy into, and in the project settings you will find a Project Token 
// section. 
// const token = 'P6woot48RjjqowUWe0XdHfdSfMx0M8CF0Qm+1R7ryhN8BlVrLapAElpy';
const token = 'rUw/6qZxtkjYHAKYKB+nMyZsxS79Ys9AJjVDFqwyNX5x87fykNGzVM0S';

// Simply your 12 seeds word associated with your wallet. This is used only for the SuperHDWallet provider
// so you can sign the txs client side, but still keep track fo the deployment within Superblocks.
const mnemonic = process.env.MNEMONIC;
console.log(createDefaultMetadata());

function createDefaultMetadata(metadata){
        let { jobId, jobURL, description, hash, branch, branchUrl, commitUrl, buildConfigId } = metadata || {};
        const { env } = process;
        console.log(env.SUPER_JOBS, process.env.SUPER_JOBS, env.CI_JOB_NAME);
        const allJobs = JSON.parse(env.SUPER_JOBS || '{}');
        let currentJobId;

        const currentJob= allJobs.length > 0 && allJobs.find(job => job.name === env.CI_JOB_NAME);
        if (currentJob) {
            currentJobId = currentJob.id;
        }

        // env variables from metadata object, Superblocks, Circle CI, Gitlab and Jenkins respectively
        return {
            jobId : jobId || currentJobId || env.CIRCLE_WORKFLOW_ID || env.CI_JOB_ID || env.BUILD_ID,
            jobURL : jobURL || env.CIRCLE_BUILD_URL || env.CI_JOB_URL || env.BUILD_URL,
            description : description || env.SUPER_COMMIT_DESCRIPTION || env.CI_COMMIT_MESSAGE,
            hash : hash || env.SUPER_COMMIT_SHA1 || env.CIRCLE_SHA1 || env.CI_COMMIT_SHA,
            branch : branch || env.SUPER_COMMIT_BRANCH || env.CIRCLE_BRANCH || env.COMMIT_BRANCH,
            branchUrl : branchUrl || env.SUPER_COMMIT_BRANCH_URL || env.CIRCLE_REPOSITORY_URL || env.CI_REPOSITORY_URL,
            commitUrl : commitUrl || env.SUPER_COMMIT_URL,
            buildConfigId : buildConfigId || env.SUPER_BUILD_CONFIG_ID,
            superblocks: env.SUPER_CI || 'false'    
        }
}

module.exports = {
  plugins: ["truffle-security"],

  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    rinkeby: {
      provider: () => {

          // Let's not double create the provider (as we will create many deployments) as Truffle calls this function many times (◔_◔)
          if (!rinkebyProvider) {
            rinkebyProvider = new SuperHDWalletProvider({
              deploymentSpaceId,
              token,
              mnemonic,
              networkId: '4',
              provider: "https://rinkeby.infura.io/v3/14a9bebf5c374938b2476abe29ca5564"
            });
          }
        
        return rinkebyProvider;
      },
      network_id: '4'
    },
    rinkeby_metamask: {
      provider: () => {
        
          // Let's not double create the provider (as we will create many deployments) as Truffle calls this function many times (◔_◔)
          if (!rinkebyMetamaskProvider) {
            rinkebyMetamaskProvider = new ManualSignProvider({ 
              deploymentSpaceId,
              token,
              from: '0xEA6630F5bfA193f76cfc5F530648061b070e7DAd', 
              endpoint: 'https://rinkeby.infura.io/v3/14a9bebf5c374938b2476abe29ca5564',
              networkId: '4',
            })
          }

          return rinkebyMetamaskProvider;
          
      },
      network_id: '4'
    },
    mainnet: {
      provider: () => {
        
          // Let's not double create the provider (as we will create many deployments) as Truffle calls this function many times (◔_◔)
          if (!mainnetProvider) {
            mainnetProvider = new ManualSignProvider({ 
              deploymentSpaceId,
              token,
              from: '0xEA6630F5bfA193f76cfc5F530648061b070e7DAd', 
              endpoint: 'https://mainnet.infura.io/v3/14a9bebf5c374938b2476abe29ca5564',
              networkId: '1',
            })
          }

          return mainnetProvider;
          
      },
      network_id: '1'
    }
  }
};
