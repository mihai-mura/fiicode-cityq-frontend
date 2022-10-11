# CityQ

CityQ este o aplicatie web care faciliteaza comunicarea intre cetatenii unui oras si administratia acestuia.

Aplictia permite creearea unor postari care reprezinta schimbarile dorite intr-un anumit oras.

CityQ a fost creeata folosind stack-ul `MERN`, fiind unul dintre cele mai populare stack-uri web. 
Pentru state management in React am folosit `Redux`.
In baza de date avem 2 colectii: una pentru useri si una pentru postari.
Pentru autorizare la api am folosit `JsonWebToken` care este salvat in localStorage, deoarece este o metoda simpla si eficienta.
Stocarea fisierelor a fost realizata folosind `firebase storage`, iar pentru trimiterea email-urilor catre utilizatori am folosit `nodemailer`.


**Elemente bonus:**
- Resetarea parolei prin email.
- Optiunea de a schimba limba site-ului (engleza/romana).
- Setarile userului unde se poate adauga o poza de profil si se pot edita datele (nume,prenume,parola,adresa).
- Email-uri de informare pentru user (cand este respinsa o postare sau nu este acceptata verificarea adresei).

Videoclip de prezentare: https://youtu.be/MTOdHeUngnw
