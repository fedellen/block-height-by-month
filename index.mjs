// Path: index.mjs
const startBlock = 1394968; // Last block of March 2024
const gatewayUri = new URL("https://arweave.net");

const getFiftyBlocks = async (nextMaxheight) =>
    fetch(
        new Request(gatewayUri + "graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `query {
                  blocks(first: 50 height: {max: ${nextMaxheight} }) {
                    edges {
                      node {
                        id
                        height
                        timestamp
                      }
                    }
                  }
                }
              `,
            }),
        })
    ).then((res) => res.json());

const timestampToDate = (timestamp) => new Date(timestamp * 1000).toISOString();
const isDateInTargetMonth = (
    date,
    targetMonthString = "2024-04" /* April 2024 */
) => date.includes(targetMonthString);

// get blocks, log out top timestamp and bottom timestamp of block range
await getFiftyBlocks(startBlock).then((data) => {
    const blocks = data.data.blocks.edges;

    blocks.sort((a, b) => a.node.height - b.node.height);
    const earliestBlock = blocks[0].node;
    const latestBlock = blocks[blocks.length - 1].node;

    console.log(
        `Earliest timestamp: ${timestampToDate(
            earliestBlock.timestamp
        )} height: ${earliestBlock.height}`
    );
    console.log(
        `Latest timestamp: ${timestampToDate(latestBlock.timestamp)} height: ${
            latestBlock.height
        }`
    );

    const firstBlockInTargetMonth = blocks.find((block) =>
        isDateInApril(timestampToDate(block.node.timestamp))
    );
    console.log(
        `First block in April: ${
            firstBlockInTargetMonth.node.height
        } timestamp: ${timestampToDate(firstBlockInTargetMonth.node.timestamp)}`
    );

    const lastBlockInMarch = firstBlockInTargetMonth.node.height - 1;
    console.log("lastBlockInMarch", lastBlockInMarch);
    console.log(
        "timestampForLastMarchBlock",
        timestampToDate(
            blocks.find((block) => block.node.height === lastBlockInMarch).node
                .timestamp
        )
    );
});
