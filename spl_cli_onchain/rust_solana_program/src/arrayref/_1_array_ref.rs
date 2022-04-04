use arrayref::{array_mut_ref, array_ref, array_refs, mut_array_refs};

fn write_u16(bytes: &mut [u8; 2], num: u16) {
	bytes[0] += num as u8;
	bytes[1] *= num as u8;
}

pub fn _1_main() {
	let data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

	println!("---------- Start  arrayref lib ----------");
	let res_arr_ref = array_ref![data, 0, 2];
	println!("array_ref 1: {:?}", res_arr_ref);

	let res_arr_ref = array_ref![data, 1, 3];
	println!("array_ref 2: {:?}", res_arr_ref);

	println!("--------------------");
	let res_arr_refs = array_refs![&data, 1, 3, 5, 1];
	println!("array_refs 1: {:?}", res_arr_refs); // ([0], [1, 2, 3], [4, 5, 6, 7, 8], [9]) . Can use ---> res_arr_refs.0, res_arr_refs.1

	println!("--------------------");
	let mut dst = [0, 1, 2, 3, 4, 0, 6, 7, 8, 9];
	let res_array_mut_ref = array_mut_ref![dst, 0, 2];
	println!("res_array_mut_ref 1: {:?}", res_array_mut_ref);
	write_u16(res_array_mut_ref, 3);

	let res_array_mut_ref = array_mut_ref![dst, 1, 4];
	println!("res_array_mut_ref 2: {:?}", res_array_mut_ref);

	println!("--------------------");
	let mut dst = [0, 1, 2, 3, 4, 0, 6, 7, 8, 9];
	let res_mut_array_refs = mut_array_refs![&mut dst, 3, 2, 5];
	println!("res_mut_array_refs 1: {:?}", res_mut_array_refs); // ([0, 1, 2], [3, 4], [0, 6, 7, 8, 9])
	write_u16(res_mut_array_refs.1, 2);

	let res_mut_array_refs = mut_array_refs![&mut dst, 3, 2, 5];
	println!("res_mut_array_refs 2: {:?}", res_mut_array_refs); // ([0, 1, 2], [5, 8], [0, 6, 7, 8, 9])

	println!("---------- End  arrayref lib ----------");
}
