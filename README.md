# 🪐 My Universe - Sistema de Gestão Acadêmica

O **My Universe** é uma aplicação Full Stack desenvolvida para auxiliar estudantes universitários na organização de sua vida acadêmica. O sistema permite o gerenciamento de disciplinas, controle de faltas e notas, organização de tarefas (provas e trabalhos) e visualização de grade horária.

---

## 🚀 Tecnologias Utilizadas

### Back-end
* **Java 17**
* **Spring Boot 3** (Web, Security, Data JPA, Validation)
* **Spring Security** com Autenticação **JWT** (Stateless)
* **Maven** para gerenciamento de dependências

### Front-end
* **Angular v20+** (Standalone Components)
* **RxJS** para programação reativa
* **SCSS** para estilização

### Banco de Dados & Infraestrutura
* **PostgreSQL**

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
* [Java JDK 17+](https://adoptium.net/)
* [Node.js](https://nodejs.org/) (versão LTS) e Angular CLI
* [PostgreSQL](https://www.postgresql.org/)
* Git

---

## 🛠️ Como Executar o Projeto (Passo a Passo)

### 1. Configuração do Banco de Dados

Crie um banco de dados local chamado `my_universe`. Em seguida, execute o script SQL abaixo para criar as tabelas e popular o banco com um **usuário de teste**.

> **Nota:** A senha do usuário de teste inserida no script é **`Senha123`**.

```sql
-- Criação do Banco
CREATE DATABASE my_universe;

-- 1. Tabela de Estudantes
CREATE TABLE tb_students (
    email VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- 2. Tabela de Disciplinas
CREATE TABLE tb_subjects (
    code VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    hours INTEGER NOT NULL,
    description VARCHAR(500),
    student_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_subject_institution
        FOREIGN KEY (student_email) 
        REFERENCES tb_students (email)
        ON DELETE RESTRICT,

    PRIMARY KEY (code, student_email)
);

-- 3. Tabela de Senhas
CREATE TABLE tb_student_passwords (
    email VARCHAR(255) PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_student_email_pwd
        FOREIGN KEY (email) 
        REFERENCES tb_students (email)
        ON DELETE CASCADE
);

-- 4. Tabela de Reset de Senha
CREATE TABLE tb_password_resets (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    
    CONSTRAINT fk_student_email_reset
        FOREIGN KEY (email) 
        REFERENCES tb_students (email)
        ON DELETE CASCADE
);

-- 5. Tabela de Preferências
CREATE TABLE tb_student_preferences (
    email VARCHAR(255) PRIMARY KEY,
    theme VARCHAR(20) DEFAULT 'light',
    CONSTRAINT fk_student_email_prefs
        FOREIGN KEY (email) 
        REFERENCES tb_students (email)
        ON DELETE CASCADE
);

-- 6. Tabela de Períodos
CREATE TABLE tb_periods (
    id SERIAL PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_period_student
        FOREIGN KEY (student_email) 
        REFERENCES tb_students (email)
        ON DELETE CASCADE,
    CONSTRAINT uk_period_owner UNIQUE (id, student_email)
);

-- 7. Tabela de Matrículas (Período <-> Disciplina)
CREATE TABLE tb_period_subjects (
    period_id INTEGER NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    subject_code VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'cursando',
    grade NUMERIC(4, 2) NULL,
    absences INTEGER NOT NULL DEFAULT 0,
	
    CONSTRAINT fk_map_to_period
        FOREIGN KEY (period_id, student_email) 
        REFERENCES tb_periods (id, student_email)
        ON DELETE CASCADE,

    CONSTRAINT fk_map_to_subject
        FOREIGN KEY (student_email, subject_code) 
        REFERENCES tb_subjects (student_email, code)
        ON DELETE CASCADE,

    CONSTRAINT chk_status CHECK (status IN ('cursando', 'aprovado', 'reprovado')),
    PRIMARY KEY (period_id, student_email, subject_code)
);

-- 8. Tabela de Tarefas
CREATE TABLE tb_tasks (
    id SERIAL PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    subject_code VARCHAR(50), 
    
    title VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    task_type VARCHAR(20) NOT NULL, -- 'PROVA', 'TRABALHO', 'ATIVIDADE', 'ESTUDO'
    
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
        
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_task_student
        FOREIGN KEY (student_email) 
        REFERENCES tb_students (email)
        ON DELETE CASCADE,

    CONSTRAINT fk_task_subject
        FOREIGN KEY (student_email, subject_code) 
        REFERENCES tb_subjects (student_email, code)
        ON DELETE SET NULL
);

-- 1. Inserir Aluno
INSERT INTO tb_students (email, name) 
VALUES ('adonis.silva@aluno.ufop.edu.br', 'Adonis Silva');

-- 2. Inserir Senha (Hash BCrypt válido para 'Senha123')
INSERT INTO tb_student_passwords (email, password_hash) 
VALUES ('adonis.silva@aluno.ufop.edu.br', '$2a$10$dcytpv2drfemVH32sH3LkeMRVoLLQ1ZxPNVB4eEJMG6RhMVn6ZVii');

-- 3. Inserir Preferências
INSERT INTO tb_student_preferences (email, theme) 
VALUES ('adonis.silva@aluno.ufop.edu.br', 'light');

-- 4. Inserir Disciplinas (Banco de Matérias)
-- Criação de códigos fictícios baseados nas iniciais
INSERT INTO tb_subjects (code, name, hours, description, student_email) VALUES 
('FSI', 'Fundamentos de Sistemas de Informação', 60, 'Disciplina introdutória', 'adonis.silva@aluno.ufop.edu.br'),
('CO', 'Comportamento Organizacional', 60, 'Disciplina de gestão', 'adonis.silva@aluno.ufop.edu.br'),
('IS', 'Informática e Sociedade', 60, 'Impactos sociais da TI', 'adonis.silva@aluno.ufop.edu.br'),
('SO', 'Sistemas Operacionais', 60, 'Kernel, processos e memória', 'adonis.silva@aluno.ufop.edu.br'),
('BD1', 'Banco de Dados 1', 60, 'Modelagem e SQL', 'adonis.silva@aluno.ufop.edu.br'),
('ECO', 'Economia', 60, 'Micro e Macroeconomia', 'adonis.silva@aluno.ufop.edu.br'),
('PLI', 'Programação Linear e Inteira', 60, 'Pesquisa Operacional', 'adonis.silva@aluno.ufop.edu.br');
-- 6. Inserir Períodos e Vincular Disciplinas (Técnica segura com DO/DECLARE ou Subselect)

-- --- PERÍODO 1 (Passado) ---
INSERT INTO tb_periods (student_email) VALUES ('adonis.silva@aluno.ufop.edu.br');

INSERT INTO tb_period_subjects (period_id, student_email, subject_code, status, grade, absences)
SELECT 
    (SELECT id FROM tb_periods WHERE student_email = 'adonis.silva@aluno.ufop.edu.br' ORDER BY id DESC LIMIT 1),
    'adonis.silva@aluno.ufop.edu.br', 
    subj.code, 
    subj.status, 
    subj.grade, 
    subj.absences
FROM (VALUES 
    ('CO',  'aprovado', 9.5, 0),
    ('IS',  'aprovado', 9.6, 0),
    ('FSI', 'aprovado', 10.0, 0)
) AS subj(code, status, grade, absences);


-- --- PERÍODO 2 (Atual) ---
INSERT INTO tb_periods (student_email) VALUES ('adonis.silva@aluno.ufop.edu.br');

INSERT INTO tb_period_subjects (period_id, student_email, subject_code, status, grade, absences)
SELECT 
    (SELECT id FROM tb_periods WHERE student_email = 'adonis.silva@aluno.ufop.edu.br' ORDER BY id DESC LIMIT 1),
    'adonis.silva@aluno.ufop.edu.br', 
    subj.code, 
    'cursando', 
    NULL, 
    0
FROM (VALUES 
    ('SO'), ('BD1'), ('ECO'), ('PLI')
) AS subj(code);

-- 7. Inserir Tarefas
INSERT INTO tb_tasks (student_email, subject_code, title, description, task_type, start_date, end_date) 
VALUES 
(
    'adonis.silva@aluno.ufop.edu.br', 
    'BD1', 
    'Gravar vídeo para o trabalho', 
    'Gravar o vídeo e editar no Clipchamp', 
    'TRABALHO', 
    '2026-01-17 08:00:00-03', 
    '2026-01-17 10:00:00-03'
),
(
    'adonis.silva@aluno.ufop.edu.br', 
    'BD1', 
    'PROVA 1', 
    NULL, 
    'PROVA', 
    '2025-11-18 20:45:00-03', 
    '2025-11-18 22:10:00-03'
);
```

### 2. Executando o Back-end (API)

#### 2.1. Navegue até a pasta api.

#### 2.2. Configure o arquivo src/main/resources/application.properties com as credenciais do seu banco local:

```
spring.datasource.url=jdbc:postgresql://localhost:5432/my_universe
spring.datasource.username=postgres
spring.datasource.password=sua_senha_aqui
```

#### 2.3. Execute a aplicação
```
mvn spring-boot:run
```
A API estará rodando em http://localhost:8080.

### 3. Executando o Front-end (UI)
#### 3.1. Navegue até a pasta ui (ou frontend).
#### 3.2. Instale as dependências:
```
npm install
```
#### 3.3. Inicie o servidor de desenvolvimento:
```
ng serve
```
A aplicação estará disponível em http://localhost:4200.

### 4. 🧪 Credenciais de Teste
#### Para acessar o sistema localmente, utilize o usuário criado pelo script SQL:
```
Login: adonis.silva@aluno.ufop.edu.br
Senha: Senha123
```

### 5. 📄 Repositório git
```
https://github.com/adonisoliveiradasilva/uniVerse
```

### 6. 📄 Documentação (Notion)
```
https://www.notion.so/BD1-my_universe-301566f800f1807f8028e42da0d61346?source=copy_link
```

