def invoice_email(translator, customer_name, invoice_number):
    return translator.gettext('Invoice {number} for {customer}').format(
        number=invoice_number,
        customer=customer_name,
    )
