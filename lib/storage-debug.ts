// This is a debugging utility to help us understand what's happening with the data
export function debugStorage() {
  if (typeof window === "undefined") return

  try {
    const students = JSON.parse(localStorage.getItem("padel_students") || "[]")
    const bookings = JSON.parse(localStorage.getItem("padel_bookings") || "[]")

    console.log("=== STORAGE DEBUG ===")
    console.log("Total students:", students.length)
    console.log("Approved students:", students.filter((s) => s.status === "approved").length)
    console.log("Pending students:", students.filter((s) => s.status === "pending").length)
    console.log("Rejected students:", students.filter((s) => s.status === "rejected").length)
    console.log("Students without status:", students.filter((s) => !s.status).length)
    console.log("All students:", students)

    console.log("Total bookings:", bookings.length)
    console.log("Confirmed bookings:", bookings.filter((b) => b.status === "confirmed").length)
    console.log("Pending bookings:", bookings.filter((b) => b.status === "pending").length)
    console.log("Bookings without status:", bookings.filter((b) => !b.status).length)
    console.log("All bookings:", bookings)
    console.log("=== END DEBUG ===")
  } catch (error) {
    console.error("Error in debugStorage:", error)
  }
}

// This function will completely reset the localStorage data to initial values
export function resetStorage() {
  if (typeof window === "undefined") return

  // Clear all existing data
  localStorage.removeItem("padel_students")
  localStorage.removeItem("padel_bookings")
  localStorage.removeItem("padel_teachers")
  localStorage.removeItem("padel_events")
  localStorage.removeItem("padel_blogs")

  // Force page reload to reinitialize everything
  window.location.reload()
}
