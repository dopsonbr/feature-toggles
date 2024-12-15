/**
 * Represents a feature in the system
 */
export interface Feature {
    id: string; // UUID
    type: string;
    owner: string;
    name: string;
    description: string | null;
    enabled: boolean;
    create_ts: Date;
  }
  
  /**
   * Represents a product in the system
   */
  export interface Product {
    id: string; // UUID
    name: string;
    description: string | null;
    owner: string;
    create_ts: Date;
  }
  
  /**
   * Represents an environment (e.g., development, staging, production)
   */
  export interface Environment {
    id: string; // UUID
    name: string;
    description: string | null;
    create_ts: Date;
  }
  
  /**
   * Represents a group in the system
   */
  export interface Group {
    id: string; // UUID
    name: string;
    description: string | null;
    owner: string;
    create_ts: Date;
  }
  
  /**
   * Represents an active feature toggle for a specific combination of
   * feature, group, product, and environment
   */
  export interface ActiveGroupFeatureToggle {
    feature_id: string; // UUID
    group_id: string; // UUID
    product_id: string; // UUID
    environment_id: string; // UUID
    create_ts: Date;
  }