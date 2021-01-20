import nodemailer, { Transporter } from 'nodemailer'
import aws from 'aws-sdk'
import mailConfig from '@config/mail'
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider'
import { inject, injectable } from 'tsyringe'
import IMailProvider from '../models/IMailProvider'
import ISendMailDTO from '../dtos/ISendMailDTO'

@injectable()
class SESMailProvider implements IMailProvider {
    private client: Transporter

    constructor(
        @inject('MailTemplateProvider')
        private mailTemplateProvider: IMailTemplateProvider,
    ) {
        this.client = nodemailer.createTransport({
            SES: new aws.SES({
                apiVersion: '2020-12-01',
            }),
        })
    }

    public async sendMail({
        to,
        subject,
        from,
        templateData,
    }: ISendMailDTO): Promise<void> {
        const { email, name } = mailConfig.defaults.from
        await this.client.sendMail({
            from: {
                name,
                address: from?.email || email,
            },
            to: {
                name: to.name,
                address: to.email,
            },
            subject,
            html: await this.mailTemplateProvider.parse(templateData),
        })
    }
}

export default SESMailProvider
