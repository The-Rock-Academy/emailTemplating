class Template {
    body: string;
    subject: string;
    attachments: string[];

    constructor(body: string, subject: string, attachments: string[]) {
        this.body = body;
        this.subject = subject;
        this.attachments = attachments;
    }
}
