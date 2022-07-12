const Fieldset = (props) => {
    const { onChange, fieldsetName, filters, type } = props;

    return (
        <div className='border-black border p-4 bg-white flex flex-wrap'>
            <fieldset className='flex flex-wrap gap-4'>
                <legend className='font-bold mb-2'>{fieldsetName}:</legend>
                {type === 'checkboxes' &&
                    filters.map((item, index) => {
                        const { name, checked } = item;
            
                        return (
                            <div className='flex flex-wrap items-center gap-1' key={name}>
                                <input checked={checked} onChange={() => onChange(index)} type="checkbox" name={fieldsetName.toLowerCase()} value={name} id={name} />
                                <label htmlFor={name}>{name}</label>
                            </div>
                        )
                    })
                }
            </fieldset>
        </div>
    )
}

export default Fieldset;