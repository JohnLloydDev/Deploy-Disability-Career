import { useState } from "react";
import { authStore } from "../stores/authStore";
import { toast } from "react-toastify";

const EditEmployerPage = () => {
  const { user, updateEmployerProfile } = authStore();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    contact: user?.contact || "",
    age: user?.age || "",
    employerInformation: {
      companyName: user?.employerInformation?.companyName || "",
      companyAddress: user?.employerInformation?.companyAddress || "",
    },
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("employerInformation.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        employerInformation: {
          ...prev.employerInformation,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateEmployerProfile(formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error("Update Error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center font-poppins">
      <div className="container max-w-screen-lg mx-auto">
        <div className="bg-white rounded shadow-lg p-8 md:p-10 mb-6">
          <form onSubmit={handleSubmit} className="grid gap-6 text-base grid-cols-1 lg:grid-cols-3">
            <div className="text-gray-600">
              <p className="font-medium text-xl">Personal Details</p>
              <p className="text-lg">Please fill out all the fields.</p>
            </div>

            <div className="lg:col-span-2 grid gap-6 text-base grid-cols-1 md:grid-cols-5">
              <div className="md:col-span-5">
                <label className="text-lg font-medium">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="h-12 border mt-1 rounded-lg px-4 w-full bg-gray-50 text-lg"
                  required
                />
              </div>

              <div className="md:col-span-5">
                <label className="text-lg font-medium">Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="h-12 border mt-1 rounded-lg px-4 w-full bg-gray-50 text-lg"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-lg font-medium">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="h-12 border mt-1 rounded-lg px-4 w-full bg-gray-50 text-lg"
                  min="18"
                  max="99"
                  required
                />
              </div>

              <div className="md:col-span-3">
                <label className="text-lg font-medium">Company Name</label>
                <input
                  type="text"
                  name="employerInformation.companyName"
                  value={formData.employerInformation.companyName}
                  onChange={handleInputChange}
                  className="h-12 border mt-1 rounded-lg px-4 w-full bg-gray-50 text-lg"
                />
              </div>

              <div className="md:col-span-5">
                <label className="text-lg font-medium">Company Address</label>
                <input
                  type="text"
                  name="employerInformation.companyAddress"
                  value={formData.employerInformation.companyAddress}
                  onChange={handleInputChange}
                  className="h-12 border mt-1 rounded-lg px-4 w-full bg-gray-50 text-lg"
                />
              </div>

              <div className="md:col-span-5 text-right">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition duration-300"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEmployerPage;
   