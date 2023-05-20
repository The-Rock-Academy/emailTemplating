class Emailer {
    private renderer: Renderer;
    private template: Template;

    constructor(templateSS, templateName: string, template_type: string="default") {
        this.template = (new TemplateSpreadsheet(templateSS)).getTemplate(templateName, template_type);
        console.log("Got template: " + JSON.stringify(this.template));
        this.renderer = new Renderer(this.template.subject, this.template.body);
    }


    /**
     * Take the data and render the email and send it to recipients
     * @param email string[] of email addresses
     * @param data An object containing the data to be rendered
     * @param attachments A string[] of file ids to be attached to the email. These are assumed to be google docs and will be rendered into pdfs.
     * @param attachments_pdf A GoogleAppsScript.Base.Blob[] of pdfs to be attached to the email.
     */
    public sendEmail(emails: string[], data, attachments_pdf: GoogleAppsScript.Base.Blob[]=[], replyTo: string = "") {
        let rendered_email = this.renderer.render_email(data);
        if (this.template.attachments.length > 0) {
            attachments_pdf = attachments_pdf.concat(this.getAttachments(this.template.attachments));
        }

        console.log("Going to send email with " + attachments_pdf.length + " attachments")

        if (replyTo != "") {
            GmailApp.sendEmail(emails.join(","), rendered_email[0], rendered_email[1], { attachments: attachments_pdf, replyTo: replyTo });
        } else {
            GmailApp.sendEmail(emails.join(","), rendered_email[0], rendered_email[1], { attachments: attachments_pdf });
        }
    }

    /**
     * Takes a string[] of google drive ids and returns a GoogleAppsScript.Base.Blob[] of pdfs
     * @param attachments Google drive ids of the files to be attached
     * @returns GoogleAppsScript.Base.Blob[] of pdfs.
     */
    private getAttachments(attachments: string[]): GoogleAppsScript.Base.Blob[] {
        return attachments.map((attachment) => {
            return DriveApp.getFileById(attachment).getAs("application/PDF");
        });
    }
}

function newEmailer(subject_template, body_template) {
    return new Emailer(subject_template, body_template);
}
