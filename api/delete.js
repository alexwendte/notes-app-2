import * as dynamoDbLib from './libs/dynamodb-lib'
import { success, failure } from './libs/response-lib'

// eslint-disable-next-line
export async function main(event) {
  const params = {
    TableName: 'notes',
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id,
    },
  }

  try {
    await dynamoDbLib.call('delete', params)
    return success({ status: true })
  } catch (e) {
    return failure({ status: false })
  }
}
