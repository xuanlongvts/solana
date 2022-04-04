use std::convert::TryInto;

fn _1_instruction_1(input: &[u8]) {
    if let Some((tag, rest)) = input.split_first() {
        println!("way 1: tag: ---> {:?}", tag);
        println!("way 1: rest: ---> {:?}", rest);
    }

    let (tag, rest) = input.split_first().unwrap();
    println!("way 2: tag: ---> {:?}", tag);
    println!("way 2: rest: ---> {:?}", rest);
}

fn _1_instruction_2(input: &[u8]) -> Result<(), &str> {
    let (tag, rest) = input.split_first().ok_or("Error mapping from Some to Ok")?;

    println!("way 3: tag: ---> {:?}", tag);
    println!("way 3: rest: ---> {:?}", rest);

    Ok(())
}

fn _1_unpack_amount_1(input: &[u8]) {
    let amount = input.get(..8); // Some([10, 20, 30, 40, 50, 60, 70, 80])
    println!("way 1: amount: ---> {:?}", amount); // still have Some
}

fn _1_unpack_amount_2(input: &[u8]) {
    let amount = input.get(..8).and_then(|i| Some(i)); // Some([10, 20, 30, 40, 50, 60, 70, 80])
    println!("way 2.1: amount: ---> {:?}", amount);

    let amount: Option<&[u8]> = input.get(..8).and_then(|i| i.try_into().ok()); // Some([10, 20, 30, 40, 50, 60, 70, 80])
    // try_into will force i to u8
    // ok ---> map (Ok, Err) to (Some, None)
    println!("way 2.2: amount: ---> {:?}", amount);
}

fn _1_unpack_amount_3(input: &[u8]) {
    let amount = input.get(..8).and_then(|i| i.try_into().ok()).map(u64::from_le_bytes); // Some(5784376957523072010)
    println!("way 3: amount: ---> {:?}", amount);
}

fn _1_unpack_amount_4(input: &[u8]) -> Result<(), &str> {
    let amount = input.get(..8).and_then(|i| i.try_into().ok()).map(u64::from_le_bytes).ok_or("Error parse u64 to bytes")?;
    println!("way 4: amount: ---> {:?}", amount);
    Ok(())
}

pub fn _1_main() {
    let data_u8_serialize: [u8; 9] = [0, 10, 20, 30, 40, 50, 60, 70, 80];

    println!("---------- Start  instruction unpack ----------");

    _1_instruction_1(&data_u8_serialize);
    _1_instruction_2(&data_u8_serialize).expect("Parse Some to Ok not success");

    println!("--------------------");

    _1_unpack_amount_1(&data_u8_serialize[1..]);
    _1_unpack_amount_2(&data_u8_serialize[1..]);
    _1_unpack_amount_3(&data_u8_serialize[1..]);
    _1_unpack_amount_4(&data_u8_serialize[1..]).expect("Error unpack");

    println!("---------- End    instruction unpack ----------");
}