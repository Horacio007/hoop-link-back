// import { Inject, Injectable } from '@nestjs/common';
// import Stripe from 'stripe';
// import { ErrorHandleService } from '../error/common.error-handle.service';
// import { TypeError } from '../enums/errors/common.error-handle.enum';
// import { IPayment } from '../interfaces/stripe/stripe.interface';
// import { StripeMode, StripePaymentMethod, StripeTipePayment } from '../enums/stripe/stripe.enum';

// @Injectable()
// export class StripeService {

//   constructor(
//       @Inject('STRIPE_CLIENT') private readonly stripeClient: Stripe,
//       private readonly errorService: ErrorHandleService
//   ) { }

//   async getSession(sessionId: string) {
//       try {
//         const session = await this.stripeClient.checkout.sessions.retrieve(sessionId);
//         return session;
//       } catch (error) {
//           this.errorService.errorHandle(error, TypeError.BadRequestException);
//       }
//   }

//   async createPayment(product: string, checkout: IPayment, tipePayment: StripeTipePayment) {
//     try {
//       switch (tipePayment) {
//         case StripeTipePayment.paymentProduct:
//           const sessionProduct = await this.stripeClient.checkout.sessions.create({
//             payment_method_types: [StripePaymentMethod.card],
//             line_items: [
//               {
//                 price: checkout.product,
//                 quantity: 1,
//               },
//             ],
//             client_reference_id: checkout.workId,
//             mode: StripeMode.payment,
//             success_url:
//               process.env.stripe_success +
//               "/api/checkout/product/" +
//               product +
//               "/{CHECKOUT_SESSION_ID}",
//             cancel_url: process.env.stripe_cancel + "/index",
//           });
          
//           return sessionProduct.id;   
//           break;
//         case StripeTipePayment.paymentMembership:
//           const sessionMembership = await this.stripeClient.checkout.sessions.create({
//             payment_method_types: [StripePaymentMethod.card],
//             line_items: [
//               {
//                 price: checkout.product,
//                 quantity: 1,
//               },
//             ],
//             client_reference_id: checkout.propertyId,
//             mode: StripeMode.subscription,
//             subscription_data: { trial_period_days: 60 },
//             success_url:
//               process.env.stripe_success + "/api/checkout/{CHECKOUT_SESSION_ID}",
//             cancel_url: process.env.stripe_cancel + "/propiedades",
//           });
          
//           return sessionMembership.id;   
//           break;
//         default:
//           break;
//       }
//     } catch (error) {
//       this.errorService.errorHandle(error, TypeError.BadRequestException)
//     }
//   }

// }
