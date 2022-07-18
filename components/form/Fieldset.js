import { useRef } from "react";

const Fieldset = (props) => {
    const { onChange, fieldsetName, filters, type } = props;
    const fieldsetNameLower = fieldsetName.toLowerCase();

    const selectItemRef = useRef();
    const selectCompRef = useRef();

    const selectChangeHandler = () => {
        onChange(selectItemRef.current.value, selectCompRef.current.value);
    }

    return (
        <div className='border-black border p-4 bg-white flex flex-wrap'>
            <fieldset className='flex flex-wrap gap-4'>
                <legend className='font-bold mb-2'>{fieldsetName}:</legend>
                {type === 'checkboxes' &&
                    filters.map((item, index) => {
                        const { name, checked } = item;
            
                        return (
                            <div className='flex flex-wrap items-center gap-1' key={name}>
                                <input checked={checked} onChange={() => onChange(index)} type="checkbox" name={fieldsetNameLower} value={name} id={name} />
                                <label htmlFor={name}>{name}</label>
                            </div>
                        )
                    })
                }
                {type === 'select' &&
                    <div className='flex flex-wrap items-center gap-1'>
                        <select className={`p-2`} ref={selectItemRef} onChange={selectChangeHandler} value={filters.value} name={fieldsetNameLower} id={fieldsetNameLower}>
                            {filters.items.map(item =>
                                <option key={`${fieldsetNameLower}-${item === '' ? 'all' : item}`} value={item}>{item === '' ? 'all' : item === 'inf' ? '∞': item}</option>
                            )}
                        </select>
                        <select className={`p-2`} ref={selectCompRef} onChange={selectChangeHandler} value={filters.comp} name={`${fieldsetNameLower}-op`} id={`${fieldsetNameLower}-op`}>
                            {[{value: 'eq', name: '='}, {value: 'lte', name: '<='}, {value: 'gte', name: '>='}].map(comp =>
                                <option key={`${fieldsetNameLower}-${comp.value}`} value={comp.value}>{comp.name}</option>
                            )}
                        </select>
                    </div>
                }
            </fieldset>
        </div>
    )
}

export default Fieldset;