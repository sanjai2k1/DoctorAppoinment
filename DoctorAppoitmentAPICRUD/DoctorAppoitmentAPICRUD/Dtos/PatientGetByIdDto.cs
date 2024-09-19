namespace DoctorAppoitmentAPICRUD.Dtos
{
    public class PatientGetByIdDto
    {
        public int PatientId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Contact { get; set; }
        public string Address { get; set; }

        public string Gender { get; set; }

        public string Password { get; set; }


        public string Image { get; set; }
        public List<BookingGetId> Bookings { get; set; }
    }
}
