fn _1_instruction_1(input: &[u8]) {
    if let Some((tag, rest)) = input.split_first() {
        println!("way 1: tag: ---> {:?}", tag);
        println!("way 1: rest: ---> {:?}", rest);
    }

    let (tag, rest) = input.split_first().unwrap();
    println!("way 2: tag: ---> {:?}", tag);
    println!("way 2: rest: ---> {:?}", rest);
}

fn _1_instruction_2(input: &[u8]) -> Result<(), String> {
    let (tag, rest) = input.split_first().ok_or("Error mapping from Some to Ok")?;

    println!("way 3: tag: ---> {:?}", tag);
    println!("way 3: rest: ---> {:?}", rest);

    Ok(())
}

pub fn _1_main() {
    let data_u8_serialize: [u8; 9] = [0, 10, 20, 30, 40, 50, 60, 70, 80];

    println!("---------- Start  instruction unpack ----------");

    _1_instruction_1(&data_u8_serialize);
    _1_instruction_2(&data_u8_serialize).expect("Parse Some to Ok not success");

    println!("---------- End    instruction unpack ----------");
}