const Specter = () => {
  return (
    <div className="specter">
      {[...new Array(5)].map((_, i) => (
        <span key={i} />
      ))}
    </div>
  )
}

export default Specter
