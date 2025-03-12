import { Module } from '@nestjs/common';
import { ErrorHandleService } from './error/common.error-handle.service';
// import { MailService } from './mail/common.mail.service';
// import { StripeService } from './stripe/common.stripe.service';
import { PasswordService } from './password/password.service';


@Module({
  controllers: [],
  providers: [
    ErrorHandleService,
    PasswordService,
  ],
  exports: [ErrorHandleService, PasswordService],
})
export class CommonModule {}
