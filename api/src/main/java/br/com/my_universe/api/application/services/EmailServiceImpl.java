package br.com.my_universe.api.application.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl {

    private final JavaMailSender mailSender;
    private final String frontendUrl = "http://localhost:4200";
    private final String fromEmail;
    
    private final String imageUrl = "https://i.imgur.com/VsgO4eK.png"; 

    public EmailServiceImpl(JavaMailSender mailSender, 
                            @Value("${spring.mail.username}") String fromEmail) {
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
    }

    public void sendPasswordSetupEmail(String toEmail, String token) {
        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("my_universe - Defina sua senha de acesso");

            String link = frontendUrl + "/set-password?token=" + token;

            String htmlContent = "<!DOCTYPE html><html><head>"
                + "<style> body { font-family: Arial, sans-serif; margin:0; padding:0; } </style>"
                + "</head><body style='margin:0; padding:0;'>"
                
                + "<table width='100%' border='0' cellspacing='0' cellpadding='0'>"
                + "  <tr><td align='center' style='padding: 20px;'>"
                
                + "    <table width='600' border='0' cellspacing='0' cellpadding='0' style='border-collapse: collapse; border: 1px solid #cccccc;'>"
                
                + "      <tr><td style='padding: 30px 20px 20px 20px; text-align: left;'>"
                + "        <h2 style='color: #333; margin-top: 0;'>Olá,</h2>"
                + "        <p style='color: #555; font-size: 16px; line-height: 1.5;'>"
                + "          Recebemos uma solicitação para criar sua conta no my_universe."
                + "        </p>"
                + "        <p style='color: #555; font-size: 16px; line-height: 1.5;'>"
                + "          Por favor, clique no link abaixo para definir sua senha. Este link expira em 15 minutos."
                + "        </p>"
                + "      </td></tr>"

                + "      <tr><td style='padding: 0 20px 30px 20px;'>"
                + "        <a href='" + link + "' target='_blank'>"
                + "          <img src='" + imageUrl + "' alt='Clique aqui para definir sua senha'"
                + "               style='width:100%; max-width:600px; height:auto; display:block; border: 0;' width='560'>"
                + "        </a>"
                + "      </td></tr>"
                
                + "      <tr><td style='padding: 0 20px 20px 20px; text-align: center; background-color: #f9f9f9;'>"
                + "        <p style='color: #777; font-size: 12px; line-height: 1.5;'>Se o botão não funcionar, copie e cole a URL abaixo:</p>"
                + "        <a href='" + link + "' target='_blank' style='color: #007BFF; text-decoration: none; word-break: break-all;'>" + link + "</a>"
                + "      </td></tr>"
                
                + "    </table>"
                
                + "  </td></tr>"
                + "</table>" 
                
                + "</body></html>";

            helper.setText(htmlContent, true);
            
            mailSender.send(message);

        } catch (Exception e) {
            System.err.println("### ERRO AO ENVIAR E-MAIL HTML: " + e.getMessage());
            throw new RuntimeException("Falha ao enviar e-mail de configuração de senha.", e);
        }
    }
}