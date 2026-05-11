import useStore from '../store'

const Buttons = () => {
  const increaseGood = useStore((state) => state.increaseGood)
  const increaseNeutral = useStore((state) => state.increaseNeutral)
  const increaseBad = useStore((state) => state.increaseBad)

  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={increaseGood}>good</button>
      <button onClick={increaseNeutral}>neutral</button>
      <button onClick={increaseBad}>bad</button>
    </div>
  )
}

export default Buttons
