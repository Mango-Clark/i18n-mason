fn help_message(bundle: &FluentBundle) -> String {
    bundle.get_message("help-title").unwrap().value().unwrap().to_string()
}

const OUTPUT_FORMAT_FLAG: &str = "--output-format";
const EXIT_USAGE_ERROR: i32 = 2;
