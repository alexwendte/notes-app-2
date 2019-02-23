import stripePackage from 'stripe'
import { calculateCost } from './libs/billing-lib'
import { success, failure } from './libs/response-lib'

// eslint-disable-next-line
export async function main(event, _context) {
  const { storage, source } = JSON.parse(event.body)
  const amount = calculateCost(storage)
  const description = 'Scratch charge'

  // Load our secret key from the  environment variables
  const stripe = stripePackage(process.env.stripeSecretKey)

  try {
    await stripe.charges.create({
      amount,
      currency: 'usd',
      description,
      source,
    })
    return success({ status: true })
  } catch (e) {
    return failure({ message: e.message })
  }
}
