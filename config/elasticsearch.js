const { Client } = require('@elastic/elasticsearch');

const client = new Client({ node: 'http://localhost:9200' });

const createIndices = async () => {
  try {
    const emailIndexExists = await client.indices.exists({ index: 'emails' });

    if (emailIndexExists.body) {
      console.log('Index "emails" already exists. Moving on.');
    } else {
      await client.indices.create({
        index: 'emails',
        body: {
          mappings: {
            properties: {
              userId: { type: 'keyword' },
              subject: { type: 'text' },
              sender: { type: 'keyword' },
              body: { type: 'text' },
              status: { type: 'keyword' },
              date: { type: 'date' }
            }
          }
        }
      });
      console.log('Created index "emails"');
    }
  } catch (error) {
    console.error('Error checking or creating indices:', error);
  }
};

module.exports = {
  client,
  createIndices
};
