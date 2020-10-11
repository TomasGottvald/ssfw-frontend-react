import React from 'react'
import { IntlProvider, FormattedNumber } from 'react-intl'
import { useDispatch } from 'react-redux'
import { gql, useQuery, ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { setPayment } from '../../../actions'
import CONFIG from '../../../Config'
import Loader from '../../Layout/Loader'
import noimage from '../../../Images/noimage.png'

function OrderPayment(props) {
    const client = new ApolloClient({
      uri: CONFIG.FEAPI_URL,
      cache: new InMemoryCache()
    });

    const dispatch = useDispatch();

    function OrderPaymentlist() {
        const GET_PAYMENT_LIST = gql`{
            payments {
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
                transports {
                    uuid
                    name
                }
            }
        }
        `;

        const { loading, error, data } = useQuery(GET_PAYMENT_LIST);

        if (loading) return <Loader />;
        if (error) return <p>Error :( {error.message}</p>;

        return data.payments.map( function (item){
            return (
                <label key={item.uuid} className="box-chooser__item" htmlFor={"transport_and_payment_form_payment_" + item.uuid }>
                    <span className="box-chooser__item__check">
                        <input onChange={ () => dispatch(setPayment(item)) }  type="checkbox" id={"transport_and_payment_form_payment_" + item.uuid } name="transport_and_payment_form[payment]" className="css-checkbox js-order-payment-input" data-id="1" value="1" />
                        <span className="css-checkbox__image"></span>
                    </span>
                    <span className="box-chooser__item__image">
                        <picture>
                            <img alt={ item.name } title="" src={ item.images[0] ? item.images[0].url : noimage } className="image-payment error loaded" itemProp="image" />
                        </picture>
                    </span>
                    <span className="box-chooser__item__title">
                        <strong className="box-chooser__title__name">
                            { item.name }
                        </strong>
                        <span className="box-chooser__item__title__description">
                            { item.description }
                        </span>
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
            <h2 id="js-label-transport_and_payment_form_payment">Payment selection</h2>
            <ApolloProvider client={client}>
                <div className="box-chooser box-chooser--smaller js-form-group">
                    <span className="js-validation-errors-list js-validation-error-list-transport_and_payment_form_payment form-error form-error--inline display-none">
                        <span className="form-error__icon"><i className="svg svg-warning"></i></span>
                        <ul className="form-error__list"></ul>
                    </span>
                    <div id="transport_and_payment_form_payment">
                        <OrderPaymentlist />
                    </div>
                </div>
            </ApolloProvider>
        </div>
    )
}

export default OrderPayment;
