import * as shell from "shelljs";

shell.cp("-R", "src/public/stylesheets", "dist/public/");
shell.cp("-R", "src/public/javascripts/lib", "dist/public/javascripts/lib");
