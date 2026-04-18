export default function Avatar({ user, size = 38 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
      style={{ width: size, height: size, background: user.color, fontSize: size * 0.36 }}
    >
      {user.initials}
    </div>
  )
}
