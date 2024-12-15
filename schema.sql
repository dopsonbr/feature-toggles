-- Create features table
CREATE TABLE features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL,
    owner VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    enabled BOOLEAN DEFAULT false,
    create_ts TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    owner VARCHAR(100) NOT NULL,
    create_ts TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create environments table
CREATE TABLE environments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    create_ts TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create groups table
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    owner VARCHAR(100) NOT NULL,
    create_ts TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create active_group_feature_toggles table with foreign key constraints
CREATE TABLE active_group_feature_toggles (
    feature_id UUID NOT NULL REFERENCES features(id),
    group_id UUID NOT NULL REFERENCES groups(id),
    product_id UUID NOT NULL REFERENCES products(id),
    environment_id UUID NOT NULL REFERENCES environments(id),
    create_ts TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (feature_id, group_id, product_id, environment_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_features_name ON features(name);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_environments_name ON environments(name);
CREATE INDEX idx_groups_name ON groups(name);
CREATE INDEX idx_active_toggles_feature ON active_group_feature_toggles(feature_id);
CREATE INDEX idx_active_toggles_group ON active_group_feature_toggles(group_id);
CREATE INDEX idx_active_toggles_product ON active_group_feature_toggles(product_id);
CREATE INDEX idx_active_toggles_environment ON active_group_feature_toggles(environment_id);