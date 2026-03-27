# API Documentation - Sistema Acadêmico e CARs

## Estrutura Implementada

### Tabelas
- **states**: Estados brasileiros (27 estados)
- **cities**: Cidades com FK para states
- **universities**: Universidades
- **courses**: Cursos com FK para universities e campus
- **cars**: Conselho Acadêmico Regional
- **car_cities**: N:N entre CARs e cidades
- **car_managers**: N:N entre CARs e membros gestores
- **members**: Atualizado com course_id e city_id

### Roles
- MEMBRO
- LIDER
- DIRIGENTE
- CA (Conselho Administrativo)
- EQUIPE_TECNICA
- ESTADUAL
- CAR (Conselheiro Acadêmico Regional)

## Endpoints

### States
```
GET    /states           - Listar todos os estados
GET    /states/:id       - Buscar estado por ID
GET    /states/uf/:uf    - Buscar estado por UF (ex: SP, RJ)
```

### Cities
```
GET    /cities                    - Listar todas as cidades
GET    /cities?stateId={id}       - Filtrar cidades por estado
GET    /cities/:id                - Buscar cidade por ID
POST   /cities                    - Criar cidade
Body: { name, ibge_code?, state_id }
```

### Universities
```
GET    /universities              - Listar todas as universidades
GET    /universities/:id          - Buscar universidade por ID
GET    /universities/:id/courses  - Listar cursos de uma universidade
POST   /universities              - Criar universidade
Body: { name, acronym? }
```

### Courses
```
GET    /courses                      - Listar todos os cursos
GET    /courses?universityId={id}    - Filtrar cursos por universidade
GET    /courses/:id                  - Buscar curso por ID
POST   /courses                      - Criar curso
Body: { name, campus?, university_id }
```

### CARs (Conselho Acadêmico Regional)
```
GET    /cars                    - Listar todas as CARs
GET    /cars/:id                - Buscar CAR por ID
GET    /cars/:id/members        - Listar membros atendidos pela CAR
POST   /cars                    - Criar CAR
Body: { name, description? }

POST   /cars/:id/managers       - Adicionar gestor à CAR
Body: { memberId }

DELETE /cars/:id/managers/:memberId  - Remover gestor da CAR

POST   /cars/:id/cities         - Vincular cidades à CAR
Body: { cityIds: string[] }

DELETE /cars/:id/cities          - Desvincular cidades da CAR
Body: { cityIds: string[] }
```

### Members (Atualizado)
```
POST   /members                 - Criar membro
Body: {
  name, cpf, password, phone,
  email_personal, email_university, ra,
  birth_date, admission_date,
  course_id,  // UUID do curso (obrigatório)
  city_id,    // UUID da cidade (obrigatório)
  sponsor?, biography?, ...
}
```

## Lógica de Negócio CAR

### Como funciona:
1. Uma CAR é criada com nome e descrição
2. Gestores (membros com role CAR) são vinculados à CAR
3. Cidades são vinculadas à CAR
4. Membros que moram nessas cidades são automaticamente atendidos pela CAR

### Exemplo de uso:
```javascript
// 1. Criar CAR
POST /cars
{ "name": "CAR São Paulo Capital", "description": "Atende região metropolitana de SP" }

// 2. Adicionar gestor
POST /cars/{carId}/managers
{ "memberId": "uuid-do-membro" }

// 3. Vincular cidades
POST /cars/{carId}/cities
{ "cityIds": ["uuid-sp", "uuid-osasco", "uuid-guarulhos"] }

// 4. Buscar membros atendidos
GET /cars/{carId}/members
// Retorna todos os membros que moram nas cidades vinculadas
```

## Fluxo de Cadastro de Membro

### Antes (Antigo):
```json
{
  "university": "USP",
  "course": "Engenharia de Software",
  "campus": "São Carlos"
}
```

### Agora (Novo):
```json
{
  "course_id": "uuid-do-curso",
  "city_id": "uuid-da-cidade"
}
```

### Como obter os IDs:
1. Listar universidades: `GET /universities`
2. Listar cursos da universidade: `GET /universities/{id}/courses`
3. Listar estados: `GET /states`
4. Listar cidades do estado: `GET /cities?stateId={id}`
5. Usar os UUIDs no cadastro do membro

## Migrations Executadas
1. `CreateRBACSystem` - Sistema de roles e permissões
2. `CreateAcademicAndCarSystem` - Sistema acadêmico e CARs

## Benefícios da Nova Estrutura
✅ Dados normalizados e consistentes
✅ Fácil adicionar novas universidades/cursos
✅ Sistema CAR escalável e flexível
✅ Queries otimizadas com relacionamentos
✅ Integridade referencial garantida
✅ Múltiplos gestores por CAR
✅ Múltiplas cidades por CAR
