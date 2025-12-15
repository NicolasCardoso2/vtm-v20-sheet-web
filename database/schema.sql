-- Criação das tabelas para o sistema de fichas do Vampiro

-- Tabela de crônicas
CREATE TABLE chronicles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    storyteller_user_id UUID REFERENCES auth.users(id) NOT NULL,
    settings_json JSONB NOT NULL DEFAULT '{
        "allowedClans": [],
        "defaultGeneration": 13,
        "maxGeneration": 15,
        "minGeneration": 4,
        "initialPoints": {
            "attributes": 7,
            "skills": 13,
            "disciplines": 3,
            "backgrounds": 5,
            "virtues": 7,
            "freebie": 15
        },
        "limits": {
            "maxAttributeAtCreation": 4,
            "maxSkillAtCreation": 3,
            "maxDisciplineAtCreation": 3,
            "maxBackgroundAtCreation": 3
        },
        "houseRules": {
            "useExtendedVirtues": false,
            "allowCustomClans": false,
            "requireApproval": true,
            "allowSelfApproval": false
        },
        "requiredFields": ["name", "concept", "clan", "nature", "demeanor"],
        "experienceRules": {
            "attributeCost": [4, 4, 4, 4, 4],
            "skillCost": [2, 2, 2, 2, 2],
            "disciplineCost": [10, 12, 14, 16, 18],
            "backgroundCost": [3, 3, 3, 3, 3],
            "virtueCost": [2, 2, 2, 2, 2]
        }
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de personagens
CREATE TABLE characters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chronicle_id UUID REFERENCES chronicles(id) NOT NULL,
    owner_user_id UUID REFERENCES auth.users(id) NOT NULL,
    
    -- Dados básicos de identidade
    name VARCHAR(255) NOT NULL,
    concept VARCHAR(255) NOT NULL,
    clan VARCHAR(100) NOT NULL,
    nature VARCHAR(100) NOT NULL,
    demeanor VARCHAR(100) NOT NULL,
    generation INTEGER NOT NULL DEFAULT 13,
    sire VARCHAR(255) DEFAULT '',
    
    -- Dados estruturados em JSON
    attributes_json JSONB NOT NULL DEFAULT '{
        "physical": {"strength": 1, "dexterity": 1, "stamina": 1},
        "social": {"charisma": 1, "manipulation": 1, "appearance": 1},
        "mental": {"perception": 1, "intelligence": 1, "wits": 1}
    }'::jsonb,
    
    skills_json JSONB NOT NULL DEFAULT '{
        "talents": {},
        "skills": {},
        "knowledges": {},
        "specializations": {}
    }'::jsonb,
    
    advantages_json JSONB NOT NULL DEFAULT '{
        "disciplines": {},
        "backgrounds": {},
        "virtues": {"conscience": 1, "self_control": 1, "courage": 1},
        "merits": {},
        "flaws": {}
    }'::jsonb,
    
    morality_json JSONB NOT NULL DEFAULT '{
        "path": "humanity",
        "rating": 7,
        "willpower": {"permanent": 1, "temporary": 1},
        "blood_pool": {"current": 10, "per_turn": 1},
        "health_levels": {
            "bruised": false,
            "hurt": false,
            "injured": false,
            "wounded": false,
            "mauled": false,
            "crippled": false,
            "incapacitated": false
        }
    }'::jsonb,
    
    -- Status e aprovação
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected')),
    approval_notes TEXT DEFAULT '',
    experience_points INTEGER DEFAULT 0,
    experience_total INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE NULL
);

-- Tabela de log de mudanças
CREATE TABLE character_changelog (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE NOT NULL,
    change_type VARCHAR(50) NOT NULL CHECK (change_type IN ('creation', 'experience', 'approval', 'edit')),
    diff_json JSONB NOT NULL,
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Índices para performance
CREATE INDEX idx_chronicles_storyteller ON chronicles(storyteller_user_id);
CREATE INDEX idx_characters_chronicle ON characters(chronicle_id);
CREATE INDEX idx_characters_owner ON characters(owner_user_id);
CREATE INDEX idx_characters_status ON characters(status);
CREATE INDEX idx_changelog_character ON character_changelog(character_id);

-- RLS (Row Level Security)
ALTER TABLE chronicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_changelog ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para chronicles
CREATE POLICY "Storytellers can manage their chronicles" ON chronicles
    FOR ALL USING (storyteller_user_id = auth.uid());

CREATE POLICY "Players can read chronicles they participate in" ON chronicles
    FOR SELECT USING (
        id IN (
            SELECT chronicle_id FROM characters 
            WHERE owner_user_id = auth.uid()
        )
    );

-- Políticas de segurança para characters
CREATE POLICY "Users can manage their own characters" ON characters
    FOR ALL USING (owner_user_id = auth.uid());

CREATE POLICY "Storytellers can manage characters in their chronicles" ON characters
    FOR ALL USING (
        chronicle_id IN (
            SELECT id FROM chronicles 
            WHERE storyteller_user_id = auth.uid()
        )
    );

-- Políticas de segurança para character_changelog
CREATE POLICY "Users can read changelog of their characters" ON character_changelog
    FOR SELECT USING (
        character_id IN (
            SELECT id FROM characters 
            WHERE owner_user_id = auth.uid()
        )
    );

CREATE POLICY "Storytellers can read changelog of chronicle characters" ON character_changelog
    FOR SELECT USING (
        character_id IN (
            SELECT c.id FROM characters c
            JOIN chronicles chr ON c.chronicle_id = chr.id
            WHERE chr.storyteller_user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create changelog entries" ON character_changelog
    FOR INSERT WITH CHECK (created_by = auth.uid());

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chronicles_updated_at BEFORE UPDATE ON chronicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON characters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();