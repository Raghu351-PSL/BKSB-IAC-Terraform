variable "allocated_storage" { 
  description = "The amount of storage (in gigabytes) to allocate to the database instance" 
  type        = number 
} 
variable "engine" { 
  description = "The name of the database engine to be used for the RDS instance (e.g., mysql, postgres, etc.)" 
  type        = string 
} 
variable "engine_version" { 
  description = "The version of the database engine" 
  type        = string 
} 
variable "instance_class" { 
  description = "The instance type of the RDS instance" 
  type        = string 
} 
variable "db_name" { 
  description = "The name of the database to be created on the RDS instance" 
  type        = string 
} 
variable "username" { 
  description = "The master username for the RDS instance" 
  type        = string 
} 
variable "password" { 
  description = "The master password for the RDS instance" 
  type        = string 
  sensitive   = true 
} 
variable "parameter_group_name" { 
  description = "The name of the DB parameter group to associate with the RDS instance" 
  type        = string 
} 
variable "backup_retention_period" { 
  description = "The number of days to retain backups for the RDS instance" 
  type        = number 
} 
variable "storage_encrypted" { 
  description = "Whether to enable storage encryption for the RDS instance" 
  type        = bool 
} 
variable "kms_key_id" { 
  description = "The ARN of the KMS key to use when encrypting the RDS instance" 
  type        = string 
} 
variable "multi_az" { 
  description = "Whether to enable Multi-AZ deployment for the RDS instance" 
  type        = bool 
} 