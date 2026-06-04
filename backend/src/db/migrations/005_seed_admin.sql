-- Migrare 005: Date initiale — contul de admin
-- ATENTIE: schimba parola dupa primul login!
-- Acest hash corespunde parolei: admin123
-- Il vom regenera cu bcryptjs in pasul urmator

INSERT INTO admin_users (email, password_hash)
VALUES (
    'ionutsandu1996@gmail.com',
    '$2b$10$placeholder.hash.to.be.replaced'
)
ON CONFLICT (email) DO NOTHING;
-- ON CONFLICT DO NOTHING = daca adminul exista deja, nu da eroare
-- util cand rulezi migrarile de mai multe ori