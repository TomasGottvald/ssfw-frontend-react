import React from 'react'
import { IntlProvider, FormattedNumber } from 'react-intl'
import { gql, useQuery, ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { useDispatch } from 'react-redux'
import { setShipping } from '../../../actions'
import CONFIG from '../../../Config'
import Loader from '../../Layout/Loader'
import noimage from '../../../Images/noimage.png'

function OrderShipping () {
    const client = new ApolloClient({
      uri: CONFIG.FEAPI_URL,
      cache: new InMemoryCache()
    });

    const dispatch = useDispatch();

    function OrderShippinglist() {
        const GET_SHIPPING_LIST = gql`{
            transports {
                uuid
                name
                description
                instruction
                position
                price {
                    priceWithVat
                    priceWithoutVat
                    vatAmount
                }
                images {
                    type
                    position
                    size
                    url
                    width
                    height
                }
                payments {
                    uuid
                    name
                }
            }
        }
        `;

        const { loading, error, data } = useQuery(GET_SHIPPING_LIST);

        if (loading) return <Loader />;
        if (error) return <p>Error :( {error.message}</p>;
        console.log(data);

        return data.transports.map( function (item){
            return (
                <label key={item.uuid} className="box-chooser__item" htmlFor={"transport_and_payment_form_transport_" + item.uuid }>
                    <span className="box-chooser__item__check">
                        <input onChange={ () => dispatch(setShipping(item)) } type="checkbox" id={"transport_and_payment_form_transport_" + item.uuid } name="transport_and_payment_form[transport]" className="css-checkbox js-order-transport-input" data-id="1" value="1" />
                        <span className="css-checkbox__image"></span>
                    </span>
                    <span className="box-chooser__item__image">
                        <picture>
                            <img alt={ item.name } title="" src={ item.images[0] ? item.images[0].url : noimage } className="image-transport error" itemProp="image" />
                        </picture>
                    </span>
                    <span className="box-chooser__item__title">
                        <strong className="box-chooser__item__title__name">
                            { item.name }
                        </strong>
                    </span>
                    <span className="box-chooser__item__price">
                        <IntlProvider locale={ CONFIG.LOCALE }>
                            <FormattedNumber
                                value={ item.price.priceWithVat }
                                style={`currency`}
                                currency={ CONFIG.CURRENCY }
                                />
                        </IntlProvider>
                    </span>
                </label>
            )
        });
    }

    return (
        <div className="box-order__info__item">
            <h2 id="js-label-transport_and_payment_form_transport">Shipping selection</h2>
            <ApolloProvider client={client} >
                <div className="box-chooser js-form-group">
                    <span className="js-validation-errors-list js-validation-error-list-transport_and_payment_form_transport form-error form-error--inline display-none">
                        <span className="form-error__icon"><i className="svg svg-warning"></i></span>
                        <ul className="form-error__list"></ul>
                    </span>
                    <div id="transport_and_payment_form_transport">
                        <OrderShippinglist />
                    </div>
                </div>
            </ApolloProvider>
        </div>
    )
}

export default OrderShipping;
