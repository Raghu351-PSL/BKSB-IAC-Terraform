module "custom_resources" { 
  source       = "../modules/custom-resources" 
  script_file  = "./scripts/custom-resource-handler.sh" 
  custom_script = "bash ./scripts/custom-resource-handler.sh" 
}